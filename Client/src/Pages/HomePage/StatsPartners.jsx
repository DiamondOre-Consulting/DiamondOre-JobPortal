import React from 'react'
import abglogo from '../../assets/ABG-logo.png'
import agarwal from '../../assets/agarwal.png'
import india from '../../assets/india-png.png'
import punjab from '../../assets/Punjab_National_Bank.png'
import sbi from '../../assets/sbinew-png.png'

const StatsPartners = () => {
  
  return (
    <div className='mt-20 '>
      <div class=" py-6 sm:py-8 lg:py-18 bg-gray-50">
        <div class="mx-auto max-w-screen-xl px-4 md:px-8">
          <div class="mb-10 md:mb-16">
            <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl font-serif">Our Work By Numbers</h2>

            <p class="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"style={{fontFamily: "'Roboto', sans-serif"}}>we partner with to the vacancies eagerly awaiting talented individuals. As each position is filled, our numerical narrative transforms, reflecting the continual influx of talent that propels our collective success.</p>
          </div>

          <div class="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0 md:divide-x">
            <div class="flex flex-col items-center md:p-4 hover:shadow-lg">
              <div class="text-xl font-bold text-blue-900 sm:text-2xl md:text-3xl">30+</div>
              <div class="text-sm font-semibold sm:text-base">Companies</div>
            </div>

            <div class="flex flex-col items-center md:p-4 hover:shadow-lg">
              <div class="text-xl font-bold text-blue-900 sm:text-2xl md:text-3xl">3000+</div>
              <div class="text-sm font-semibold sm:text-base">Vacancies</div>
            </div>

            <div class="flex flex-col items-center md:p-4 hover:shadow-lg">
              <div class="text-xl font-bold text-blue-900 sm:text-2xl md:text-3xl">20,000+</div>
              <div class="text-sm font-semibold sm:text-base">Got Placed</div>
            </div>

            <div class="flex flex-col items-center md:p-4 hover:shadow-lg">
              <div class="text-xl font-bold text-blue-900 sm:text-2xl md:text-3xl">A couple</div>
              <div class="text-sm font-semibold sm:text-base">Coffee breaks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Get hired in top Companies component starts */}

      <div className="bg-white py-6 sm:py-8 lg:py-8 mt-20">
  <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-1 lg:text-3xl font-serif">Trusted by the best</h2>
    <div className='bg-blue-900 w-56 h-1 align-center mx-auto'></div>

    <marquee behavior="scroll" direction="left" scrollamount="12" scrolldelay="0">
    <div className="flex flex-wrap justify-between sm:gap-4 gap-0 sm:justify-start md:justify-between lg:justify-around xl:justify-between items-center p-4 mt-5">
  <div className="flex justify-center text-indigo-500 object-cover mb-4">
    <img src={abglogo} alt="" className="w-14 sm:w-14 md:w-20 lg:w-24 object-cover " />
  </div>

  <div className="flex justify-center text-indigo-500 object-cover mb-4">
    <img src={sbi} alt="" className="w-14 sm:w-14 md:w-20 lg:w-24 object-cover" />
  </div>

  <div className="flex justify-center text-indigo-500 object-cover mb-4">
    <img src={agarwal} alt="" className="w-14 sm:w-14 md:w-20 lg:w-24 object-cover" />
  </div>

  <div className="flex justify-center text-indigo-500 object-cover mb-4">
    <img src={india} alt="" className="w-14 sm:w-14 md:w-20 lg:w-24 object-cover" />
  </div>

  <div className="flex justify-center text-indigo-500 object-cover mb-4">
    <img src={punjab} alt="" className="w-14 sm:w-14 md:w-20 lg:w-24 object-cover" />
  </div>
</div>
    </marquee>
  </div>
</div>


      {/* Get hired in top Companies component ends */}




    </div>
  )
}

export default StatsPartners
