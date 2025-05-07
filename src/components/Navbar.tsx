// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { useSession, signOut } from 'next-auth/react'
// import {User} from 'next-auth'
// import { Button } from './ui/button'
// import ToggleTheme from '@/components/ToggleTheme'


// const Navbar = () => {
//     const {data: session} = useSession()

//     const user: User  = session?.user as User

//   return (
//    <nav className=' p-2.5 md:p-6 shadow-md '>
//     <div className='container mx-auto flex md:flex-row justify-between items-center'>
//         <a className='text-xl font-bold md:mb-0 flex items-center h-full' href="#">Cipher Voice</a>
        
//         {
//             session ? (
//                 <>
//                 <span className='mr-4'>Welcome,{user?.username} | {user?.email} </span>
//                 <div className='flex'>    
//                     <ToggleTheme />
//                 <Button className='md:w-auto cursor-pointer' onClick={() => signOut()}>logout</Button>
//                 </div>
//                 </>
//             ) : (
//                 <Link href={'/sign-in'}>
//                 <Button className='w-full md:w-auto hover:bg-gray-600 cursor-pointer'>Login</Button>
//                 </Link>
//             )
//         }
//     </div>
//    </nav>
//   )
// }

// export default Navbar




'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import ToggleTheme from '@/components/ToggleTheme'
import { Menu, X } from 'lucide-react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu"

  

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <nav className='p-2 md:p-6 shadow-md '>
            <div className='container mx-auto flex justify-between items-center'>
                <a className='text-xl font-bold flex items-center' href="#">
                    Cipher Voice
                </a>

                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-4'>
                    {session ? (
                        <>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-transparent hover:bg-accent">
                                            {user?.username || 'Menu'}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="">
                                                <li className="flex items-center">
                                                    <ToggleTheme />
                                                </li>
                                                
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Button 
                                                            className="flex items-center px-3.5 " 
                                                            variant="ghost"
                                                            onClick={() => signOut()}
                                                        >
                                                            Logout
                                                        </Button>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </>
                    ) : (
                        <Link href={'/sign-in'}>
                            <Button className='hover:bg-gray-600 cursor-pointer'>
                                Login
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className='md:hidden'>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className='md:hidden bg-background w-full '>
                    {session ? (
                        <div className='flex flex-col items-center gap-1.5 '>
                            <div className='flex justify-center w-full'>
                                <ToggleTheme />
                            </div>
                            <Button 
                                className='px-5 ml-2.5' 
                                onClick={() => {
                                    signOut()
                                    setIsMobileMenuOpen(false)
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Link href={'/sign-in'}>
                            <Button className='w-full hover:bg-gray-600 cursor-pointer'>
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar