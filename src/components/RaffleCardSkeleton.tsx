'use client'

import { Skeleton } from "./ui/skeleton"


export function RaffleCardSkeleton() {
    return (
        <div className="rounded-lg border border-gray-200 shadow">
        <Skeleton className="w-full h-80" />
        <div className="flex-col justify-between relative p-4">
          <div className="mb-4">
          <Skeleton className="w-1/2 h-6" />
          </div>
          <div className="mb-6 text-sm">
          <Skeleton className="w-1/4 h-4 mb-2" />
          <Skeleton className="w-1/4 h-4" />
          </div>
          <div className="mb-3">
          <Skeleton className="w-1/2 h-3" />
          </div>
          <div className="flex justify-between">
          <Skeleton className="w-1/2 h-8" />
          <Skeleton className="w-1/3 h-8" />
          </div>
        </div>
      </div>
    )
}