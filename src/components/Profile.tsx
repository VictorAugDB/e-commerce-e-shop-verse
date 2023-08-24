'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import {
  Icon as FeatherIcon,
  LogOut,
  ShoppingBag,
  Star,
  User,
  XCircle,
} from 'react-feather'
import { twMerge } from 'tailwind-merge'

import NextImage from '@/components/NextImage'

export default function Profile() {
  const [isMouseIn, setIsMouseIn] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="flex h-8 w-8 justify-center">
      {session && session.user && session.user.image ? (
        <Picture
          imageUrl={session.user.image}
          isMouseIn={isMouseIn}
          setIsMouseIn={setIsMouseIn}
          className="hover:opacity-80"
        />
      ) : (
        <Picture
          isMouseIn={isMouseIn}
          setIsMouseIn={setIsMouseIn}
          className="bg-green-700 hover:bg-[rgba(50,80,46,0.8)]"
        />
      )}

      <AnimatePresence>
        {isMouseIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-48 flex w-fit flex-col rounded bg-slate-800 px-4 py-2 text-white"
          >
            <Option icon={User} title="Manage My Account" />
            <Option icon={ShoppingBag} title="My Order" />
            <Option icon={XCircle} title="My Cancellations" />
            <Option icon={Star} title="My Reviews" />
            <Option icon={LogOut} title="Logout" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type PictureProps = {
  imageUrl?: string
  isMouseIn: boolean
  setIsMouseIn: (state: boolean) => void
  className: string
}

function Picture({
  imageUrl,
  isMouseIn,
  setIsMouseIn,
  className,
}: PictureProps) {
  function handleShowOptions() {
    setIsMouseIn(!isMouseIn)
  }

  return (
    <motion.div
      onClick={handleShowOptions}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={twMerge(
        'flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-all',
        className,
      )}
    >
      {imageUrl ? (
        <NextImage
          src={imageUrl}
          width={32}
          height={32}
          alt="user-image"
        ></NextImage>
      ) : (
        <User onClick={() => setIsMouseIn(!isMouseIn)} className="text-white" />
      )}
    </motion.div>
  )
}

type OptionProps = {
  icon: FeatherIcon
  title: string
}

function Option({ icon: Icon, title }: OptionProps) {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded p-[.375rem] transition-all hover:bg-white/10">
      <Icon />
      {title}
    </div>
  )
}