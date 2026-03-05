'use client'

import * as React from 'react'

import { Plus, X } from 'lucide-react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select'

interface CreatableSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CreatableSelect({
  options,
  value,
  onChange,
  placeholder = '選擇年份或新增...',
}: CreatableSelectProps) {
  const [isCustom, setIsCustom] = React.useState(false)

  const handleSelectChange = (val: string) => {
    if (val === 'custom_option_trigger') {
      setIsCustom(true)
      onChange('') // Clear value for typing
    } else {
      onChange(val)
    }
  }

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="輸入年份..."
          autoFocus
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsCustom(false)
            onChange(options[0] || '') // Reset to first option or empty
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Select
      value={options.includes(value) ? value : ''}
      onValueChange={handleSelectChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {value || placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
        <SelectItem value="custom_option_trigger">
          <span className="text-muted-foreground flex items-center font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            新增年份...
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
