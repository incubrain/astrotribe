// urlClassifier.ts

import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-cpu'
import fs from 'fs'
import * as path from 'path'
import { FeaturePipeline } from './features/feature.pipeline'
import { ensureDirectoryExists } from '@helpers'
import { CustomLogger } from '@core' // Import the logger

tf.setBackend('cpu')

interface TrainingSample {
  features: number[]
  label: number
  url: string
}

export class UrlClassifier {
  private log = new CustomLogger()
  private model!: tf.LayersModel
  private featurePipeline: FeaturePipeline
  private categories: string[]
  private modelVersion = 'v1'
  private modelPath = `./app/ai/models/urlClassifier/${this.modelVersion}`
  private ready: Promise<void>

  constructor() {
    this.categories = ['news', 'jobs', 'unknown']
    this.loadTrainingData()
    this.featurePipeline = new FeaturePipeline('./app/news/data/featuresConfig.json')
    ensureDirectoryExists(this.modelPath)
    this.ready = this.initializeModel()
    this.log.setDomain('url_classifier')
    this.watchTrainingDataFile()
  }

  private async initializeModel(): Promise<void> {
    try {
      await this.loadModel()
      this.log.info('Model loaded successfully.')
    } catch (error: any) {
      this.log.warn('Model not found or input shape mismatch, creating and training a new one.')
      const data = this.loadTrainingData()
      this.model = this.createModel()
      await this.trainModel(data)
      await this.saveModel()
    }
  }

  private createModel(): tf.LayersModel {
    const numberOfFeatures = 10 // Adjust based on your features
    const model = tf.sequential()
    model.add(
      tf.layers.dense({
        inputShape: [numberOfFeatures],
        units: 64,
        activation: 'relu',
      }),
    )
    model.add(
      tf.layers.dense({
        units: this.categories.length,
        activation: 'softmax',
      }),
    )
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })
    this.log.debug('Model created and compiled')
    return model
  }

  private oneHotEncode(labelIndex: number): number[] {
    const encoding = Array(this.categories.length).fill(0)
    if (labelIndex >= 0 && labelIndex < this.categories.length) {
      encoding[labelIndex] = 1
    }
    return encoding
  }

  public async trainModel(data: TrainingSample[]): Promise<void> {
    try {
      this.log.info(`Starting model training with ${data.length} samples`)
      const { trainingData, validationData } = this.splitData(data, 0.8)

      this.log.debug(`Training data: ${trainingData.length} samples`)
      this.log.debug(`Validation data: ${validationData.length} samples`)

      const xsTrain = tf.tensor2d(trainingData.map((sample) => sample.features))
      const ysTrain = tf.tensor2d(trainingData.map((sample) => this.oneHotEncode(sample.label)))

      const xsVal = tf.tensor2d(validationData.map((sample) => sample.features))
      const ysVal = tf.tensor2d(validationData.map((sample) => this.oneHotEncode(sample.label)))

      this.log.info('Starting model fitting...')
      const history = await this.model.fit(xsTrain, ysTrain, {
        epochs: 50,
        validationData: [xsVal, ysVal],
        verbose: 0,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            this.log.verbose(
              `Epoch ${epoch + 1}: loss = ${logs?.loss?.toFixed(
                4,
              )}, accuracy = ${logs?.acc?.toFixed(4)}`,
            )
          },
        },
      })

      this.log.info('Model fitting completed')

      // Evaluate the model
      const evaluation = this.evaluateModel(validationData)
      this.log.info('Model Evaluation:', evaluation)

      // Save training history
      await this.saveTrainingHistory(history)
    } catch (error: any) {
      this.log.error('Error during model training', error)
      throw error
    }
  }

  private async saveTrainingHistory(history: tf.History): Promise<void> {
    const historyPath = `${this.modelPath}/training_history.json`
    await fs.promises.writeFile(historyPath, JSON.stringify(history))
    this.log.debug('Training history saved to:', { historyPath })
  }

  private extractFeatures(url: string): number[] {
    if (!this.featurePipeline) {
      this.log.error('Feature pipeline is not initialized')
      return Array(10).fill(0) // Return default features
    }
    try {
      const featureDict = this.featurePipeline.extractFeatures(url)
      const featureNames = this.featurePipeline.getFeatureNames()
      this.log.debug(`Extracted features for URL ${url}:`, featureDict)
      return featureNames.map((name) => featureDict[name] ?? 0)
    } catch (error: any) {
      this.log.error(`Error extracting features for URL ${url}`, error)
      return Array(10).fill(0) // Return default features
    }
  }

  public async predict(url: string): Promise<string> {
    await this.ready
    try {
      this.log.info(`[UrlClassifier] Predicting category for URL: ${url}`)
      const features = this.extractFeatures(url)
      this.log.debug(`[UrlClassifier] Features for ${url}:`, features)

      const inputTensor = tf.tensor2d([features])
      const prediction = this.model.predict(inputTensor) as tf.Tensor
      const predictionArray = prediction.dataSync()
      this.log.debug(`[UrlClassifier] Raw prediction for ${url}:`, predictionArray)

      const maxProbability = Math.max(...predictionArray)
      const predictedIndex = predictionArray.indexOf(maxProbability)

      const confidenceThreshold = 0.5 // Adjust as needed
      if (maxProbability < confidenceThreshold) {
        this.log.warn(
          `[UrlClassifier] Prediction below confidence threshold for ${url}. Returning 'unknown'.`,
        )
        return 'unknown'
      }

      const predictedCategory = this.categories[predictedIndex]
      this.log.info(
        `[UrlClassifier] Predicted category for ${url}: ${predictedCategory} (confidence: ${maxProbability})`,
      )
      return predictedCategory
    } catch (error: any) {
      this.log.error(`[UrlClassifier] Error in classifier predict for URL: ${url}`, error)
      return 'unknown'
    }
  }

  private loadTrainingData(): TrainingSample[] {
    const dataPath = './app/news/data/trainingData.json'
    this.log.debug(`[loadTrainingData] Attempting to load training data from: ${dataPath}`)

    let rawData: string
    try {
      rawData = fs.readFileSync(dataPath, 'utf-8')
      this.log.debug(`[loadTrainingData] Successfully read raw data from file`)
    } catch (error: any) {
      this.log.error(`[loadTrainingData] Error reading training data file`, error)
      throw new Error(`Failed to read training data file: ${error.message}`)
    }

    let jsonData: any
    try {
      jsonData = JSON.parse(rawData)
      this.log.debug(`[loadTrainingData] Successfully parsed JSON data`)
    } catch (error: any) {
      this.log.error(`[loadTrainingData] Error parsing JSON data`, error)
      throw new Error(`Failed to parse training data JSON: ${error.message}`)
    }

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      this.log.error(`[loadTrainingData] Invalid training data: empty or not an array`)
      throw new Error('Training data is empty or not an array')
    }

    this.log.info(`[loadTrainingData] Loading ${jsonData.length} training samples`)

    const samples: TrainingSample[] = []
    const unknownLabels = new Set<string>()

    jsonData.forEach((sample: any, index: number) => {
      try {
        if (!sample.url || !sample.label) {
          this.log.warn(`[loadTrainingData] Sample at index ${index} is missing url or label`)
          return // Skip this sample
        }

        const labelIndex = this.categories.indexOf(sample.label)
        if (labelIndex === -1) {
          unknownLabels.add(sample.label)
          this.log.warn(
            `[loadTrainingData] Unknown label '${sample.label}' for URL: ${sample.url}. Using 'unknown' category.`,
          )
          samples.push({
            url: sample.url,
            features: this.extractFeatures(sample.url),
            label: this.categories.indexOf('unknown'),
          })
        } else {
          samples.push({
            url: sample.url,
            features: this.extractFeatures(sample.url),
            label: labelIndex,
          })
        }
      } catch (error: any) {
        this.log.error(`[loadTrainingData] Error processing sample at index ${index}`, error)
      }
    })

    if (unknownLabels.size > 0) {
      this.log.warn(
        `[loadTrainingData] Found ${unknownLabels.size} unknown labels:`,
        Array.from(unknownLabels),
      )
    }

    if (samples.length < this.categories.length * 2) {
      this.log.warn(
        `[loadTrainingData] Warning: Only ${samples.length} valid samples for ${this.categories.length} categories. Model may not train effectively.`,
      )
    }

    this.log.info(`[loadTrainingData] Successfully loaded ${samples.length} training samples`)
    this.log.debug(
      `[loadTrainingData] Category distribution:`,
      this.getCategoryDistribution(samples),
    )

    return samples
  }

  private getCategoryDistribution(samples: TrainingSample[]): Record<string, number> {
    const distribution: Record<string, number> = {}
    this.categories.forEach((category) => (distribution[category] = 0))

    samples.forEach((sample) => {
      const category = this.categories[sample.label]
      distribution[category] = (distribution[category] || 0) + 1
    })

    return distribution
  }

  public async retrain(): Promise<void> {
    try {
      this.log.info('Starting model retraining...')
      const data = this.loadTrainingData()
      await this.trainModel(data)
      await this.saveModel()
      this.log.info('Model retrained successfully.')
    } catch (error: any) {
      this.log.error('Error during model retraining:', error)
    }
  }

  private watchTrainingDataFile(): void {
    const dataPath = './app/news/data/trainingData.json'
    fs.watch(dataPath, (eventType, filename) => {
      if (eventType === 'change') {
        this.log.info(
          `Training data file ${filename} has changed. Reloading data and retraining model.`,
        )
        this.retrain()
      }
    })
  }

  public async updateModel(newSamples: TrainingSample[]): Promise<void> {
    await this.ready
    const data = this.loadTrainingData().concat(newSamples)
    await this.trainModel(data)
  }

  private splitData(
    data: TrainingSample[],
    trainRatio: number,
  ): { trainingData: TrainingSample[]; validationData: TrainingSample[] } {
    const shuffledData = data.sort(() => 0.5 - Math.random())
    const trainSize = Math.floor(shuffledData.length * trainRatio)
    const trainingData = shuffledData.slice(0, trainSize)
    const validationData = shuffledData.slice(trainSize)
    return { trainingData, validationData }
  }

  private evaluateModel(validationData: TrainingSample[]): any {
    const xsVal = tf.tensor2d(validationData.map((sample) => sample.features))
    const ysTrue = validationData.map((sample) => sample.label)

    const predictions = this.model.predict(xsVal) as tf.Tensor2D
    const ysPred = predictions.argMax(1).dataSync()

    let correctPredictions = 0
    for (let i = 0; i < ysPred.length; i++) {
      if (ysPred[i] === ysTrue[i]) {
        correctPredictions++
      }
    }

    const accuracy = correctPredictions / ysPred.length

    // You can compute precision, recall, and F1-score for each category if needed.

    return {
      accuracy,
      total: ysPred.length,
      correctPredictions,
    }
  }

  private async saveModel(): Promise<void> {
    try {
      const modelDir = path.resolve(this.modelPath)
      if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true })
      }

      const modelPath = path.join(modelDir, 'model.json')
      const weightsPath = path.join(modelDir, 'weights.bin')

      const modelJSON = this.model.toJSON()
      fs.writeFileSync(modelPath, JSON.stringify(modelJSON))

      const weightData = await this.model.getWeights()[0].data()
      const weightDataBuffer = Buffer.from(weightData.buffer)
      fs.writeFileSync(weightsPath, new Uint8Array(weightDataBuffer))

      this.log.info('Model saved successfully:', { modelPath })
    } catch (error: any) {
      this.log.error('Error saving model:', error)
      throw error
    }
  }

  private async loadModel(): Promise<void> {
    try {
      const modelPath = path.join(this.modelPath, 'model.json')
      const weightsPath = path.join(this.modelPath, 'weights.bin')

      if (!fs.existsSync(modelPath) || !fs.existsSync(weightsPath)) {
        throw new Error('Model files not found')
      }

      const modelJSON = JSON.parse(fs.readFileSync(modelPath, 'utf8'))
      const weightData = fs.readFileSync(weightsPath)

      const modelArtifacts: tf.io.ModelArtifacts = {
        modelTopology: modelJSON,
        weightData,
      }

      this.model = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts))
      this.log.info('Model loaded successfully from:', { modelPath: this.modelPath })
      this.log.info('Model summary:', this.model.summary())
    } catch (error: any) {
      this.log.error('Error loading model:', error)
      throw error
    }
  }
}
