export default defineComponent({
    props: {
        type: String, // info, error, success
        event: String, // payment success/ error
        message: String, // more info
    },
    // display different types of feedback, error/success etc
    render: (props) => {
        console.log('error is handled', props)
        return (
            <div>
                <div
                    id="alert"
                    class="transition duration-150 ease-in-out lg:w-11/12 mx-auto py-3 px-4 dark:bg-gray-800 bg-white md:flex items-center justify-between shadow rounded"
                >
                    <div class="sm:flex sm:items-start lg:items-center">
                        <div class="flex items-end">
                            <div class="mr-2 text-green-400"></div>
                            <p class="mr-2 text-sm lg:text-base font-bold text-gray-800 dark:text-gray-100">
                                {props.type}
                            </p>
                        </div>
                        <div class="h-1 w-1 bg-gray-300 dark:bg-gray-700 rounded-full mr-2 hidden xl:block"></div>
                        <p class="text-sm lg:text-base text-gray-600 dark:text-gray-400 pt-2 sm:pt-0 pb-2 sm:pb-0">
                            Your Payment was successful. You can now use our
                            services.
                        </p>
                    </div>
                    <div class="flex items-center justify-end sm:mt-4 md:mt-0 ml-4 md:pl-4 lg:pl-0"></div>
                </div>
            </div>
        )
    },
})
