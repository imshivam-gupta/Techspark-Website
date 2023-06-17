import { Avatar, Card, CardBody, CardFooter, CardHeader, Tooltip, Typography } from "@material-tailwind/react"
import Tool from "../components/Tool"
import {motion} from "framer-motion"
import ProjectCard from "../components/ProjectCard"

const Developer = () => {

    return (
        <div className="flex flex-col px-10 py-6">
       
            <div className="flex flex-row justify-around space-x-6">
                <div class="font-sans leading-tight bg-grey-lighter p-8">
                    <div class="max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                        <div 
                        class="bg-cover h-40 bg-[url('/cardcover.png')]"></div>
                        <div class="border-b px-4 pb-6">
                            <div class="text-center sm:text-left sm:flex mb-4">
                                <img class="h-32 w-32 rounded-full border-4 border-white -mt-16 mr-4" src="/pp.jpg" alt="" />
                                <div class="py-2">
                                    <h3 class="font-bold text-2xl mb-1">Shivam Gupta</h3>
                                    <div class="inline-flex text-grey-dark sm:flex items-center">
                                        <svg class="h-5 w-5 text-grey mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                                        New Delhi, IN
                                    </div>
                                </div>
                            </div>
                            <div class="flex mt-6 mb-2">
                                <button class="flex-1 rounded-full border-2 border-grey font-semibold text-black px-4 py-2 bg-purple-400 text-white" onClick={()=>window.open("https://drive.google.com/file/d/1KaV5TcAovQEcMpgb5-06x6OnYH5kfyMy/view?usp=sharing")}>RESUME</button>
                                <button class="flex-1 rounded-full border-2 border-grey font-semibold text-black mx-2 px-4 bg-purple-400 text-white py-2">MESSAGE</button>
                            </div>
                        </div>
                        <div class="px-4 py-4">
                            
                            <div class="flex flex-row gap-6 justify-center">
                                
                            <Tooltip content="Check my Website" className="bg-white text-black shadow-lg" placement="bottom-center">
                                            <img
                                            src="/webicon.png"
                                            alt=""
                                            className="object-contain h-8 w-8 cursor-pointer my-auto"
                                            onClick={() => window.open("https://shivamgupta2003.netlify.app/")}
                                            />
                            </Tooltip>

                            <Tooltip content="Follow on Instagram" className="bg-white text-black shadow-lg" placement="bottom-center">
                                            <img
                                            src="/instagram.svg"
                                            alt=""
                                            className="object-contain h-10 w-10 cursor-pointer"
                                            onClick={() => window.open("https://www.instagram.com/shivamm._.gupta._/")}
                                            />
                                        </Tooltip>
                        
                                        <Tooltip content="Follow on Twitter" className="bg-white text-black shadow-lg" placement="bottom-center">
                                        
                                            <img
                                            src="/twitter.svg"
                                            alt=""
                                            className="object-contain h-10 w-10 cursor-pointer"
                                            onClick={() => window.open("https://twitter.com/shivam1176")}
                                            />
                                        </Tooltip>

                                        <Tooltip content="Follow on Github" className="bg-white text-black shadow-lg" placement="bottom-center">
                                        
                                            <img
                                            src="/github.svg"
                                            alt=""
                                            className="object-contain h-10 w-10 cursor-pointer"
                                            onClick={() => window.open("https://github.com/imshivam-gupta")}
                                            />
                                    
                                        </Tooltip>

                                        <Tooltip content="Follow on Linkedin" className="bg-white text-black shadow-lg" placement="bottom-center">
                                        
                                            <img
                                            src="/linkedin.svg"
                                            alt=""
                                            className="object-contain h-10 w-10 cursor-pointer"
                                            onClick={() => window.open("https://www.linkedin.com/in/shivam-gupta-bbb669226/")}
                                            />

                                        </Tooltip>
                                        
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-2/3 flex flex-col justify-between">
                <div className="text-center antialiased font-mono text-2xl font-semibold tracking-wide text-indigo-700 py-4">PROJECTS</div>

                    <div className="grid grid-cols-2 justify-between items-stretch flex-wrap">

                        <ProjectCard  
                            imgsrc={'p2img.png'} 
                            name={'Portfolio'} 
                            description={"My portfolio website showcases my skills and projects. From web development to algortihm designing, my website displays a diverse range of projects that I have worked on. "} 
                            linksrc={'https://shivamgupta2003.netlify.app/'}
                        />

                        <ProjectCard  
                            imgsrc={'pp3img.png'} 
                            name={'Shopello'} 
                            description={'Built an e-commerce site focusing more on functionailities rahter than designing.This was made with help of bootstrap and is resposnive. It Also has an admin panel includedin it'} 
                            linksrc={'https://shopello-mern-app.onrender.com/'}
                        />
                        <ProjectCard  
                            imgsrc={'pp3img.png'} 
                            name={'Techspark'} 
                            description={'Built an e-commerce site focusing more on functionailities rahter than designing.This was made with help of bootstrap and is resposnive. It Also has an admin panel includedin it'} 
                            linksrc={'https://techspark.vercel.app/'}
                        />
                        <ProjectCard  
                            imgsrc={'p4img.png'} 
                            name={'Fettle'} 
                            description={'Built a sports-faciilities managmnet system for colleges. Also pitched this idea in various ideathons. And this website was ranked 3rd among 500+ teams. It was made using React.js and Node.js'} 
                            linksrc={'/'}
                        />
                    </div>
                    
                
                  
                </div>
            </div>

            <div className="flex flex-col mt-10">
                        <div className="text-center antialiased font-mono text-2xl font-semibold tracking-wide text-indigo-700 py-6">TECHSTACK</div>


        <motion.div className="grid grid-cols-7 flex flex-wrap justify-between">

            

            <Tool toolName={"C++"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"/>
            <Tool toolName={"Java"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"/>
            <Tool toolName={"Python"} toolIconClass=" https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"/>
            <Tool toolName={"Javascript"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"/>
           
            <Tool toolName={"Node.js"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg"/>
            <Tool toolName={"Express.js"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"/>
      
            <Tool toolName={"React.js"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg"/>
            <Tool toolName={"React Native"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"/>
            <Tool toolName={"Next JS"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"/>

            <Tool toolName={"MongoDB"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"/>
            <Tool toolName={"MySQL"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"/>
            <Tool toolName={"Firebase"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"/>
            
            
            <Tool toolName={"Redux"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"/>
            <Tool toolName={"Bootstrap"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain.svg"/>
            <Tool toolName={"Tailwind"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg"/>
            
            <Tool toolName={"Git"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-plain.svg"/>
            <Tool toolName={"Figma"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"/>
            <Tool toolName={"HTML"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"/>
            <Tool toolName={"CSS"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"/>
            <Tool toolName={"Github"} toolIconClass="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"/>
            
          
                    </motion.div>

            </div>

          
          

          

        </div>
    )
}

export default Developer