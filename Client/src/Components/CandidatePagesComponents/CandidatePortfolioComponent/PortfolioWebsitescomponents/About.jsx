import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    useEffect(() => {
        gsap.fromTo('.aboutme', 
            { opacity: 0, y: 50 }, 
            {
                opacity: 1, 
                y: 0, 
                duration: 1, 
                scrollTrigger: {
                    trigger: '.aboutme',
                    start: 'top 80%',
                }
            }
        );

        gsap.fromTo('.abouttext p', 
            { opacity: 0, y: 50 }, 
            {
                opacity: 1, 
                y: 0, 
                duration: 1, 
                delay: 0.5, 
                stagger: 0.25,
                scrollTrigger: {
                    trigger: '.abouttext',
                    start: 'top 80%',
                }
            }
        );
    }, []);

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='bg-profilecolor z-40 h-96 w-96 shadow-xl flex flex-col justify-center items-center'>
                <h1 className='text-5xl font-bold text-center text-black myfont aboutme'>About me</h1>
            </div>

            {/* right side */}
            <div className='bg-white z-40 h-96 w-80'>
                <div className='flex flex-col px-4 py-1 abouttext'>
                    <p className='mt-10'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore adipisci quam porro numquam. Magni est consequatur optio similique, possimus nulla, odio aperiam tempora aut aliquid, tempore hic. Natus, inventore animi.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste dignissimos minus commodi ipsa in deserunt veniam consequatur quis assumenda perspiciatis, officia id mollitia, repellendus expedita! Ipsum blanditiis officiis debitis quo?</p>
                </div>
            </div>
        </div>
    );
}

export default About;
