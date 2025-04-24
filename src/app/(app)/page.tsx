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

        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-16">
          <div className="left md:w-1/2">
            <p className="flex items-center gap-2"><Check /> {`Truth hits harder when it's anonymous.`}</p>
            <p className="flex items-center gap-2 text-seagreen"><Check /> No egos. No names. Just raw, honest feedback.</p>
            <p className="flex items-center gap-2"><Check /> {`Because real change starts with what's real.`}</p>
          </div>
          <div className="right md:w-1/2 flex justify-center">
            <Image
              src="/anonymous-icone-1.jpg"
              alt="Anonymous feedback icon"
              width={400}
              height={300}
              className="max-w-full h-auto md:max-w-md opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>


        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-xs mt-32 " >
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


        <Accordion type="single" collapsible className="w-full mt-10 md:w-96">
          {FAQ.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.Question}</AccordionTrigger>
              <AccordionContent>{faq.Answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </main>
      <footer className='text-center p-4 md:p-6'>@ 2025 Cipher Voice. All rights reserved</footer>
    </>
  )
}

export default Home