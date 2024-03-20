import React from 'react'
import cvimg from '../../assets/5.svg'
import { Link } from 'react-router-dom'
const CvSection = () => {
    return (
        <section class="mt-24">
            <h2 class="text-center text-xl lg:text-3xl md:text-2xl px-16 font-bold">Craft a job-winning CV in Simple steps</h2>
            <div class="grid grid-cols-3 px-48 py-12 gap-2 flex justify-center align-center place-items-center">
                <div class="steps__image steps__image2 hidden md:block"><img decoding="auto" data-loaded="true" data-src="https://cdn-images.zety.com/images/zety/landings/templates/step_2@2x.png" data-srcset="https://cdn-images.zety.com/images/zety/landings/templates/step_2@1x.png 1x, https://cdn-images.zety.com/images/zety/landings/templates/step_2@2x.png 2x, https://cdn-images.zety.com/images/zety/landings/templates/step_2@3x.png 3x" src="https://cdn-images.zety.com/images/zety/landings/templates/step_2@2x.png" alt="Zety CV builder template filling step" width="170" height="235" /><noscript>
                    <img src="https://cdn-images.zety.com/images/zety/landings/templates/step_2@2x.png" alt="Zety CV builder template filling step" width="170" height="235" /></noscript></div>


                <div class="steps__image steps__image1 hidden md:block">
                    <img decoding="auto" data-loaded="true" data-src="https://cdn-images.zety.com/images/zety/landings/templates/step_1@2x.png" data-srcset="https://cdn-images.zety.com/images/zety/landings/templates/step_1@1x.png 1x, https://cdn-images.zety.com/images/zety/landings/templates/step_1@2x.png 2x, https://cdn-images.zety.com/images/zety/landings/templates/step_1@3x.png 3x" src="https://cdn-images.zety.com/images/zety/landings/templates/step_1@2x.png" alt="Zety CV builder template selection step" width="156" height="235" /><noscript>
                        <img src="https://cdn-images.zety.com/images/zety/landings/templates/step_1@2x.png" alt="Zety CV builder template selection step" width="156" height="235" /></noscript></div>

                <div class="steps__image steps__image4 hidden md:block">
                    <img decoding="auto" data-loaded="true" data-src="https://cdn-images.zety.com/images/zety/landings/templates/step_4@2x.png" data-srcset="https://cdn-images.zety.com/images/zety/landings/templates/step_4@1x.png 1x, https://cdn-images.zety.com/images/zety/landings/templates/step_4@2x.png 2x, https://cdn-images.zety.com/images/zety/landings/templates/step_4@3x.png 3x" src="https://cdn-images.zety.com/images/zety/landings/templates/step_4@2x.png" alt="Zety CV builder download step" width="219" height="260" /><noscript>
                        <img src="https://cdn-images.zety.com/images/zety/landings/templates/step_4@2x.png" alt="Zety CV builder download step" width="219" height="260" /></noscript></div></div>
                        <div class="grid-cols-3 gap-2 px-12 lg:px-48 md:px-12 -mt-16 lg:grid sm:block md:grid place-items-center">
                            <p className="mb-6"><span className='px-4 py-3 bg-blue-950 text-white border border-0 rounded-full mr-2'>1</span>Fill the Form</p>
                            <p className="mb-6"><span className='px-4 py-3 bg-blue-950 text-white border border-0 rounded-full mr-2'>2</span>Click on Save Button</p>
                            <p className="mb-6"><span className='px-4 py-3 bg-blue-950 text-white border border-0 rounded-full mr-2'>3</span>Download Your Resume Now</p>
                           </div>
                           <div className='flex justify-center align-center mt-16 mb-4'>

                           <Link to={'/cv-dashboard'} rel="nofollow" className='bg-red-400  px-4 text-center py-4 text-white  border border-0 rounded-2xl'>Create your CV</Link>

                           </div>
                           </section>
    )
}

export default CvSection