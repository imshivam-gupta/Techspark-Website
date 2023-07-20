import React from 'react'
import {motion } from 'framer-motion';

const Tool = ({toolName,toolIconClass}) => {
  return (

        <motion.div 
            initial="hidden" 
            whileInView={"visible"} 
            variants={
                { 
                    visible: {
                        y: 0,
                        opacity: 1,
                        transition: { type: "spring", },
                    },
                    hidden: { opacity: 1, y: 80 },
                }
            }

            className="py-2 px-4 bg-gray-200 md:m-4 mx-2 mt-6 rounded-lg flex items-center hover:scale-125  md:w-44 w-40"
        >
            <img alt="" src={toolIconClass} className="w-12" />
            <h4 className="text-md ml-4">{toolName}</h4>
        </motion.div>

  )
}

export default Tool