'use client'

import { createClient } from './supabase'
import { createContext, useContext, useState } from 'react'

const SupabaseContext = createContext(createClient())

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)