import React from "react";

const HomeNews = () => {
  return (
    <div className="mx-10 my-16">
      {/* Employee of the month */}
      <h2 className="text-4xl mb-6 text-center px-10 font-bold text-gray-800">
        Employee Of The Month
      </h2>
      <div className="flex justify-center mb-16">
      <a
        href="#"
        className="relative block overflow-hidden rounded-lg border border-gray-100 bg-gray-300 p-4 sm:p-6 lg:p-8 w-1/2"
      >
        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

        <div className="sm:flex sm:justify-between sm:gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
              Random Random
            </h3>

            <p className="mt-1 text-xs font-medium text-gray-600">
              Employee Of The Month
            </p>
          </div>

          <div className="hidden sm:block sm:shrink-0">
            <img
              alt="Paul Clapton"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
              className="h-16 w-16 rounded-lg object-cover shadow-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="max-w-[40ch] text-sm text-gray-500">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit
            illum provident a, ipsa maiores deleniti consectetur nobis et eaque.
          </p>
        </div>

        <dl className="mt-6 flex gap-4 sm:gap-6">
          <div className="flex flex-col-reverse">
            <dt className="text-sm font-medium text-gray-600">Published</dt>
            <dd className="text-xs text-gray-500">31st June, 2021</dd>
          </div>

          <div className="flex flex-col-reverse">
            <dt className="text-sm font-medium text-gray-600">Reading time</dt>
            <dd className="text-xs text-gray-500">3 minute</dd>
          </div>
        </dl>
      </a>
      </div>

      {/* Announcements */}
      <h2 className="text-3xl mb-6 text-center px-10 font-bold text-gray-800">
        Breaking News & Announcements
      </h2>
      <div className="space-y-4">
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-5 rounded-lg bg-gray-300 p-4">
            <p className="font-semibold text-gray-800">1.</p>
            <h2 className="font-medium text-blue-950">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed
              nihil inventore harum, perspiciatis porro doloribus obcaecati quas
              possimus veritatis cum quod maiores pariatur quae tempora dolore
              earum distinctio magnam eius!
            </h2>
          </summary>
        </details>

        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-5 rounded-lg bg-gray-300 p-4">
            <p className="font-semibold text-gray-800">2.</p>
            <h2 className="font-medium text-blue-950">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed
              nihil inventore harum, perspiciatis porro doloribus obcaecati quas
              possimus veritatis cum quod maiores pariatur quae tempora dolore
              earum distinctio magnam eius!
            </h2>
          </summary>
        </details>
      </div>
    </div>
  );
};

export default HomeNews;
