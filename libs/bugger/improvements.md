# Implementation Plan: Debugger Improvements

Here's a high-level implementation plan for the requested features:

## 1. Condensed Console Logs

### Approach

Enhance the log deduplication system with smarter pattern matching to dramatically reduce repetitive
errors in the output.

### Implementation Steps

1. **Create Error Pattern Matcher**

   - Develop pattern matching algorithms that identify error signatures beyond exact matches
   - Include stack trace analysis to group errors with similar root causes

2. **Implement Error Classification**

   - Group errors by root cause patterns (not just error messages)
   - Create category-based grouping (Network, DOM, Script, etc.)

3. **Update Log Storage**

   - Modify `prepareLLMContext` in `index.ts` to use the new pattern matcher
   - Track error frequency with representative examples

4. **Logging Format**
   - Store condensed logs with counts, timestamps, and representative examples
   - Include pattern information for developer context

## 2. Health Score Calculation

### Approach

Create a 0-100 health scoring system that evaluates page health based on error severity, performance
metrics, and resource failures.

### Implementation Steps

1. **Define Scoring Algorithm**

   - Create weighted scoring for different issue types:
     - Critical errors (high weight)
     - Performance metrics from CDP data (medium weight)
     - Failed resource loads (variable weight by resource type)
     - Warning-level issues (low weight)

2. **Implement Score Calculator**

   - Add a `calculateHealthScore` function to the `WebsiteCrawler` class
   - Apply normalization to keep scores in 0-100 range
   - Add threshold indicators (Good: 80-100, Warning: 50-79, Poor: 0-49)

3. **Add Performance Metrics**

   - Enhance performance metrics collection if needed
   - Ensure CDP session captures core web vitals

4. **Output Integration**
   - Add health score to page metadata
   - Include score explanation/breakdown for transparency

## 3. Unified Summary View

### Approach

Create a single dashboard HTML file that aggregates critical issues across all pages for a
high-level view.

### Implementation Steps

1. **Create Summary Data Structure**

   - Develop functions to aggregate issues across pages
   - Prioritize issues based on severity and frequency
   - Include sitewide patterns and metrics

2. **Generate Dashboard HTML**

   - Create an HTML template for the dashboard
   - Include interactive elements (sorting, filtering)
   - Integrate charts/visualizations for key metrics

3. **Modify `analyze.ts`**

   - Enhance analysis to generate the unified view
   - Add cross-page issue correlation

4. **Link to Page Details**
   - Ensure dashboard links to individual page reports for details
   - Create bidirectional navigation between views

## 4. Single File Output Per Page

### Approach

Consolidate all page-specific debugging information into a single file with a YAML/JSON metadata
section and markdown content.

### Implementation Steps

1. **Design File Format**

   - Create structure with:
     - YAML/JSON frontmatter for metadata (health score, screenshot path, timestamps)
     - Markdown body for detailed issues
     - References to external assets (screenshots)

2. **Update Output Format in `processUrl`**

   - Modify to generate the consolidated format
   - Include screenshot reference instead of separate files
   - Use markdown formatting for readability

3. **Update File Structure**

   - Modify directory structure generation
   - Create media subdirectory for screenshots
   - Update reference paths

4. **Modify Result Processing**
   - Update how the crawler saves results
   - Ensure backward compatibility with analysis tools

## 5. Build Log Integration

### Approach

Capture and output build errors/warnings into a single build-log.txt file.

### Implementation Steps

1. **Modify Debug Script**

   - Update `debug-build.sh` to capture build output
   - Add error/warning extraction from build process

2. **Create Build Log Parser**

   - Develop parser to extract meaningful errors/warnings
   - Format for readability and actionability

3. **Add Build Context**

   - Include build environment details
   - Timestamp and build command used

4. **Integration with Summary**
   - Link build errors to affected pages when possible
   - Include build health in overall summary

## Timeline and Dependencies

1. **Phase 1 (Foundation)**

   - Implement enhanced log deduplication
   - Design consolidated file format
   - Modify build script for log capture

2. **Phase 2 (Core Features)**

   - Implement health score calculation
   - Create single file output per page
   - Build log integration

3. **Phase 3 (Integration)**
   - Create unified summary dashboard
   - Link all components together
   - Final testing and refinement

## Technical Considerations

- Ensure backward compatibility with existing tools
- Maintain performance with larger sites
- Consider accessibility of reports
- Ensure error patterns are maintainable/extensible

This plan provides a structured approach to implementing all requested improvements while
maintaining a focus on developer experience and actionable debugging output.
