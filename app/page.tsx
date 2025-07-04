import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import HeroSection from '@/components/HeroSection'
import {  getPopularCompanions, getRecentSessions } from '@/lib/actions/companion.actions'
import { getSubjectColor } from '@/lib/utils'
import React from 'react'
// app/page.tsx
export const dynamic = "force-dynamic";


const Page = async() => {
const recentSessionsCompanions = await getRecentSessions(15);
const popularCompanions = await getPopularCompanions();

  return (
    <>
    <HeroSection/>
    <div className='bg-gradient-to-br from-[#f9f6ff] via-[#f0f8ff] to-white overflow-hidden'>
    <main className='!bg-gradient-to-br from-[#f9f6ff] via-[#f0f8ff] to-white overflow-hidden'>
      
      <h1 >Popular Companions</h1>
       <section className="home-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {popularCompanions.map((companion) => (
              <CompanionCard
                key={companion.id}
                {...companion}
                
                color={getSubjectColor(companion.subject)}
              />
            ))}
          </section>
      <section className='home-section'>
        <CompanionsList
        title="Recently Completed Sessions"
        companions={recentSessionsCompanions}
        classNames="w-[50vw] max-lg:w-full"
        />
        <CTA/>
      </section>
    </main>
    </div>
    </>
  )
}

export default Page