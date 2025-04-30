'use client'
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image';
import messages from '@/messages.json'
import FAQ from '@/FAQ.json'
import { Check } from 'lucide-react';

const Home = () => {
  return (
    <>
      <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 to-slate-950 text-white px-4 md:px-16  py-16">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-sm">
            Let Your Words Speak, Not Your Identity.
          </h1>
          <p className="mt-3 md:mt-5 text-lg md:text-xl text-gray-300">An anonymous space to give feedback or suggestions to anyone.

          </p>
        </section>

        <div className="flex flex-col-reverse md:flex-row justify-between mx-20 items-center md:gap-20">
          <div className="right md:w-1/2 flex justify-center p-12">
            <Image
              src="/anonymous-icone-1.jpg"
              alt="Anonymous feedback icon"
              width={500}
              height={400}
              style={{ width: '100%', height: 'auto' }} 
      className="opacity-80 hover:opacity-100 transition-opacity rounded-lg"
            />
          </div>
          <div className="left md:w-1/2" >
            <p className="flex items-center gap-2 pb-2"><Check className='bg-green-400' /> {`Truth hits harder when it's anonymous.`}</p>
            <p className="flex items-center gap-2 pb-2"><Check className='bg-green-400' /> No egos. No names. Just raw, honest feedback.</p>
            <p className="flex items-center gap-2 pb-2"><Check className='bg-green-400' /> {`Because real change starts with what's real.`}</p>
          </div>
        </div>


        <div className='flex flex-col-reverse md:flex-row justify-between gap-10 items-center mx-28'>
          <div className="flex flex-col w-full md:w-1/2">
            <p className='mb-3' >{`Everyone has something to say - an appreciation, a suggestion, or even a hard truth.
            Our platform gives people the space to share honest feedback without fear or filters.
            Whether it's for a friend, a teammate, or a stranger, your words have power.
            Help others grow, reflect, and improve - one message at a time.
            It’s simple, anonymous, and made to spark real conversations.
            Because growth starts with honest feedback.`} </p>
            <p>{` Every opinion fuels our next move.
            Your words inspire us to grow, improve, and innovate.
            These stories aren't just feedback—
            they're proof that we’re on the right track.`}
            </p>
          </div>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-xs mt-20 " >
            <CarouselContent>
              {
                messages.map((messages, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card >
                        <CardHeader>
                          {messages.title}
                        </CardHeader>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-lg font-semibold">{messages.content}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious className='text-gray-500' />
            <CarouselNext className='text-gray-500' />
          </Carousel>
        </div>


        <div className='mt-12 text-3xl '>
          <div className='flex justify-center items-center underline font-bold'>
            {`FAQ's`}
          </div>

          <div className="w-full md:w-7xl mx-auto mt-2 pl-1.5">
            <Accordion type="single" collapsible>
              {FAQ.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.Question}</AccordionTrigger>
                  <AccordionContent>{faq.Answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

      </main>
      <footer className='text-center p-4 md:p-6'>@ 2025 Cipher Voice. All rights reserved</footer>
    </>
  )
}

export default Home