import { useDashboardStats } from "@/lib/api/dashboard";
import { useAuthStore } from "@/lib/stores/AuthStore";
import React, { useMemo } from "react";

type CardData = {
  subtitle: string;
  total: number;
  color?: string;
};

export const TotalCard = React.memo(() => {
  const { data: stats, isLoading } = useDashboardStats();
  const role = useAuthStore((state) => state.role);

  const cards = useMemo<CardData[]>(() => {
    if (!stats) return [];
    
    // For SuperAdmin: show all cards
    if (role === 'superAdmin') {
      return [
        {
          subtitle: "Total Enrolled Students",
          total: stats.totalEnrolled,
        },
        {
          subtitle: "Total Present Today",
          total: stats.totalPresentToday,
        },
        {
          subtitle: "Total Absent Today",
          total: stats.totalAbsentToday,
        },
        {
          subtitle: "IELTS Present",
          total: stats.ielts,
        },
        {
          subtitle: "PTE Present",
          total: stats.pte,
        },
        {
          subtitle: "SAT Present",
          total: stats.sat,
        },
        {
          subtitle: "Duolingo Present",
          total: stats.duolingo,
        },
      ];
    }
    
    // For IELTS Admin: show only IELTS-related cards
    if (role === 'ieltsAdmin') {
      return [
        {
          subtitle: "Total IELTS Enrolled",
          total: stats.totalEnrolled,
        },
        {
          subtitle: "IELTS Present Today",
          total: stats.totalPresentToday,
        },
        {
          subtitle: "IELTS Absent Today",
          total: stats.totalAbsentToday,
        },
      ];
    }
    
    // For PTE Admin: show only PTE-related cards
    if (role === 'pteAdmin') {
      return [
        {
          subtitle: "Total PTE Enrolled",
          total: stats.totalEnrolled,
        },
        {
          subtitle: "PTE Present Today",
          total: stats.totalPresentToday,
        },
        {
          subtitle: "PTE Absent Today",
          total: stats.totalAbsentToday,
        },
      ];
    }
    
    // For SAT Admin: show only SAT-related cards
    if (role === 'satAdmin') {
      return [
        {
          subtitle: "Total SAT Enrolled",
          total: stats.totalEnrolled,
        },
        {
          subtitle: "SAT Present Today",
          total: stats.totalPresentToday,
        },
        {
          subtitle: "SAT Absent Today",
          total: stats.totalAbsentToday,
        },
      ];
    }
    
    // For Duolingo Admin: show only Duolingo-related cards
    if (role === 'duolingoAdmin') {
      return [
        {
          subtitle: "Total Duolingo Enrolled",
          total: stats.totalEnrolled,
        },
        {
          subtitle: "Duolingo Present Today",
          total: stats.totalPresentToday,
        },
        {
          subtitle: "Duolingo Absent Today",
          total: stats.totalAbsentToday,
        },
      ];
    }
    
    // Default fallback (shouldn't reach here)
    return [
      {
        subtitle: "Total Enrolled Students",
        total: stats.totalEnrolled,
      },
      {
        subtitle: "Total Present Today",
        total: stats.totalPresentToday,
      },
      {
        subtitle: "Total Absent Today",
        total: stats.totalAbsentToday,
      },
    ];
  }, [stats, role]);

  // Determine number of skeleton cards based on role
  const skeletonCount = role === 'superAdmin' ? 7 : 3;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(skeletonCount)].map((_, index) => (
          <div
            key={index}
            className="border flex flex-col bg-muted p-6 py-8 rounded-md animate-pulse"
          >
            <div className="h-8 bg-gray-300 rounded mb-5 w-3/4"></div>
            <div className="h-10 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((item, index) => (
          <div
            key={index}
            className="border flex flex-col bg-primary p-6 py-8 rounded-md hover:shadow-md transition-shadow"
          >
            <h2 className="font-semibold text-lg md:text-xl pb-4 text-white">
              {item.subtitle}
            </h2>
            <span className="font-semibold text-3xl md:text-4xl text-white">
              {item.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
TotalCard.displayName = "TotalCard";
