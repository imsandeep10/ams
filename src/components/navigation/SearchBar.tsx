import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input' 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStudentSearch } from '@/lib/api/useStudents'

// interface
interface User {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  role: string
  profileImage?: {
    filename: string
  }
}

interface Student {
  id: string
  faculty: string
  interestedCourse: string
  language: string
  user: User
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
  language: string
  profileImageUrl?: string
}

type GroupedData = Record<string, SearchItem[]>

const SearchBar: React.FC = () => {
  const [value, setValue] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [debouncedValue, setDebouncedValue] = useState<string>('')
  const dropdownRef = useRef<HTMLDivElement>(null) //expects a div element that start with empty 
  const navigate = useNavigate()
  
  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, 500)
    return () => clearTimeout(timer)
  }, [value])
  
  // when click outside closes the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current // does the box exist??
        &&
         !dropdownRef.current.contains(event.target as Node)) //if cliked outside the box
         {
        setIsDropdownOpen(false) // close the dropdown box
      }
    }
    document.addEventListener('mousedown', handleClickOutside) //mousedown than run the function
    // prevent memory leak 
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const shouldSearch = debouncedValue.trim().length >= 1

  const { data: searchData, isError, isLoading } = useStudentSearch(
    shouldSearch ? debouncedValue : '',
    { enabled: shouldSearch }
  )

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
      language: student.language,
      profileImageUrl: student.user.profileImage 
        ? `/api/files/${student.user.profileImage.filename}` 
        : undefined
    }))
  }, [searchData])

  const groupedData: GroupedData = useMemo(() => {
    return transformedData.reduce((acc: GroupedData, item: SearchItem) => {
      const category = item.language || 'Other' 
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {})
  }, [transformedData])


  const handleSelect = (item: SearchItem): void => {
    setValue('')
    setIsDropdownOpen(false)
    navigate(`/student-profile/${item.id}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value)
    setIsDropdownOpen(true)
  }

  const getInitials = (name: string): string => {
    return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2)
  }

  const showDropdown = isDropdownOpen && value.length >= 1

  return (
    <div className="w-64 relative" ref={dropdownRef}> 
      <Input 
        placeholder="Search students..." 
        value={value} 
        onChange={handleInputChange} 
        onFocus={() => setIsDropdownOpen(true)} 
        className='mt-1'
      />
      
      {showDropdown && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border rounded-md mt-1 shadow-md z-50 max-h-[300px] overflow-y-auto">
          
          {isLoading && (
            <div className="p-3 text-sm text-gray-500 text-center">Loading...</div>
          )}

          {isError && (
            <div className="p-3 text-sm text-red-500 text-center">Error loading students</div>
          )}

          {!isLoading && !isError && transformedData.length === 0 && (
            <div className="p-3 text-sm text-gray-500 text-center">No students found</div>
          )}

          {!isLoading && !isError && Object.keys(groupedData).map((category) => (
            <div key={category}>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-zinc-900 sticky top-0">
                {category}
              </div>
              
              {groupedData[category].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer text-sm transition-colors"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item.profileImageUrl} alt={item.label} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(item.label)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col truncate">
                    <span className="font-medium truncate">{item.label}</span>
                    <span className="text-xs text-gray-500 truncate">{item.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(SearchBar)