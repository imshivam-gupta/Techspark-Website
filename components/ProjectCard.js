import React from 'react'
import {motion } from 'framer-motion';

const ProjectCard = ({imgsrc,name,description,linksrc}) => {
  return (
    <motion.div
      initial={"hidden"}
      whileInView={"visible"}
      variants={{
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      className="
      max-w-xl  bg-wgite  rounded-lg border border-gray-200 shadow-lg my-4 mx-4"
    >
        <a href="linksrc">
        <img
          className="rounded-t-lg w-full"
          src={imgsrc}
          alt=""
        />
      </a>
      <div className="p-5">
        <a href="helo">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <a
          href={linksrc}
          className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-purple-600 rounded-lg hover:bg-purple-200 focus:ring-4 focus:outline-none focus:ring-purple-200-300"
        >
          Visit Now
          <svg
            className="ml-2 -mr-1 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            ></path>
          </svg>
        </a>
      </div>
     
    </motion.div>
  )
}

export default ProjectCard