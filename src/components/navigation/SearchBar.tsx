import React, { useState, useMemo } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useStudentSearch } from '@/lib/api/useStudents'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Inline type definitions
interface User {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  profileImage?: {
    id: string
    filename: string
    originalName: string
    mimeType: string
    size: string
  }
  profileImageId?: string | null
  role: string
  otp?: string | null
  otpExpireTime?: string | null
}

interface Student {
  id: string
  academicQualification: string
  classTime: string
  faculty: string
  gpaOrPercentage: number
  interestedCourse: string
  language: string
  preferredCountry: string
  user: User
  yearOfCompletion: string
}


interface SearchItem {
  id: string
  label: string
  category: string
  email: string
  phoneNumber: string
  faculty: string
  interestedCourse: string
  user?: User
  language:string
  profileImageUrl?: string
}

type GroupedData = Record<string, SearchItem[]>

const SearchBar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const navigate = useNavigate()
  
  const { data: searchData, isPending, isError } = useStudentSearch(value)

  // Transform API data with proper typing
  const transformedData: SearchItem[] = useMemo(() => {
    if (!searchData?.students) return []
    
    return searchData.students.map((student: Student): SearchItem => ({
      id: student.id,
      label: student.user.fullName,
      category: student.faculty || 'General',
      email: student.user.email,
      phoneNumber: student.user.phoneNumber,
      faculty: student.faculty,
      interestedCourse: student.interestedCourse,
      user: student.user,
      language:student.language,
      // Construct profile image URL - adjust this based on your API response structure
      profileImageUrl: student.user.profileImage 
        ? `/api/files/${student.user.profileImage.filename}` 
        : undefined
    }))
  }, [searchData])

  // Group data by category with proper typing
  const groupedData: GroupedData = useMemo(() => {
    return transformedData.reduce((acc: GroupedData, item: SearchItem) => {
      const category = item.language
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {})
  }, [transformedData])

  // Find selected student with proper typing
  const selectedStudent: SearchItem | undefined = useMemo(() => {
    return transformedData.find((item: SearchItem) => 
      item.label.toLowerCase() === value.toLowerCase()
    )
  }, [transformedData, value])

  const handleSelect = (currentValue: string): void => {
    const selectedItem = transformedData.find(item => 
      item.label.toLowerCase() === currentValue.toLowerCase()
    )
    
    if (selectedItem) {
      setValue(currentValue === value ? '' : currentValue)
      setOpen(false)
      
      // Navigate to student profile
      navigate(`/student-profile/${selectedItem.id}`)
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="w-64">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2 opacity-50" />
            )}
            <span className="text-sm truncate">
              {selectedStudent
                ? selectedStudent.label
                : 'Search students...'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search students..." 
              value={value}
              onValueChange={setValue}
            />
            <CommandList>
              {isError && (
                <CommandEmpty>Error loading students</CommandEmpty>
              )}
              {!isError && transformedData.length === 0 && value && (
                <CommandEmpty>No students found</CommandEmpty>
              )}
              {!isError && Object.keys(groupedData).length > 0 && (
                <>
                  {Object.entries(groupedData).map(([category, items]) => (
                    <CommandGroup key={category} heading={category}>
                      {items.map((item: SearchItem) => (
                        <CommandItem
                          key={item.id}
                          value={item.label}
                          onSelect={handleSelect}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage 
                              src={item.profileImageUrl} 
                              alt={item.label}
                            />
                            <AvatarFallback className="text-xs">
                              {getInitials(item.label)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 truncate">{item.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default React.memo(SearchBar)