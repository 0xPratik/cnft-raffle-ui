"use client";
import type { RaffleItem } from '../types'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ClockIcon } from 'lucide-react'
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
dayjs.extend(relativeTime);
dayjs.extend(utc);

interface RaffleTimerProps extends RaffleItem {
  className?: string
}

export const RaffleTimer = (props: RaffleTimerProps) => {
  const [timeUntilRaffle, setTimeUntilRaffle] = useState({
    seconds: 0,
    minutes: 0,
  })

  const updateRaffleTime = () => {
    const seconds = dayjs(props.endDate).diff(dayjs(), 'second')
    const minutes = dayjs(props.endDate).diff(dayjs(), 'minute')

    setTimeUntilRaffle({
      seconds,
      minutes,
    })
  }

  useEffect(() => {
    const updateRaffleTime = () => {
        const seconds = dayjs(props.endDate).diff(dayjs(), 'second')
        const minutes = dayjs(props.endDate).diff(dayjs(), 'minute')
    
        setTimeUntilRaffle({
          seconds,
          minutes,
        })
      }
    updateRaffleTime()
    const timer = setInterval(updateRaffleTime, 1000)
    return () => clearInterval(timer)
  }, [props.endDate])

  return (
    <p
      className={clsx(
        'flex items-center gap-1 text-sm italic',

        // props.ticketsPurchased === 0 && 'mt-11',

        timeUntilRaffle.seconds < 0 && 'text-gray-400',
        timeUntilRaffle.seconds > 0 &&
          timeUntilRaffle.seconds < 60 &&
          'animate-pulse',
        timeUntilRaffle.seconds >= 0 &&
          timeUntilRaffle.minutes < 10 &&
          'text-red-400',
        timeUntilRaffle.seconds > 0 &&
          timeUntilRaffle.minutes < 60 &&
          'text-orange-400',
        timeUntilRaffle.seconds > 0 &&
          timeUntilRaffle.minutes > 60 &&
          'text-indigo-400',

        props.className
      )}
    >
      <ClockIcon className="w-4 h-4" />
      {timeUntilRaffle.seconds > 60 && 'ends '}
      {timeUntilRaffle.seconds > 0 &&
        timeUntilRaffle.seconds < 60 &&
        'ends in '}
      {timeUntilRaffle.seconds < 0 && 'ended '}
      {timeUntilRaffle.seconds > 0 && timeUntilRaffle.seconds < 60
        ? timeUntilRaffle.seconds
        : dayjs(props.endDate).fromNow()}
      {timeUntilRaffle.seconds > 0 &&
        timeUntilRaffle.seconds < 60 &&
        ' seconds'}
    </p>
  )
}
