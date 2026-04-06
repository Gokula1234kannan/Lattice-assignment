import React from 'react';

export const SkeletonBox = ({ className = '', height = '20px', width = '100%' }) => (
  <div 
    className={`animate-pulse bg-white/5 rounded-lg ${className}`} 
    style={{ height, width }}
  />
);

export const CardSkeleton = () => (
  <div className="glass-card flex flex-col items-center justify-center p-6 !rounded-2xl border-white/5">
    <SkeletonBox height="32px" width="32px" className="mb-4 !rounded-xl" />
    <SkeletonBox height="10px" width="40%" className="mb-2" />
    <SkeletonBox height="24px" width="60%" className="mb-2" />
    <SkeletonBox height="8px" width="30%" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card p-6 !rounded-2xl border-white/5 min-h-[350px]">
    <div className="flex justify-between mb-8">
      <SkeletonBox height="20px" width="30%" />
      <SkeletonBox height="20px" width="15%" />
    </div>
    <div className="flex items-end gap-2 h-48 px-4">
      {[...Array(12)].map((_, i) => (
        <SkeletonBox key={i} height={`${Math.random() * 60 + 20}%`} className="!rounded-t-md opacity-20" />
      ))}
    </div>
    <div className="mt-8 flex justify-between">
      {[...Array(6)].map((_, i) => (
        <SkeletonBox key={i} height="10px" width="10%" />
      ))}
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
    {[...Array(count)].map((_, i) => <CardSkeleton key={i} />)}
  </div>
);
