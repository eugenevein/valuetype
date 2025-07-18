
"use client";

import * as React from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { type ValueTypeFormData } from './value-type-form-schema';
import { VALUE_TYPES_CONFIG, type LevelOption } from '@/config/value-types.tsx';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Loader2, Shirt } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ValueTypeFormProps {
  form: UseFormReturn<ValueTypeFormData>;
  onSubmit: (data: ValueTypeFormData) => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
  onCancelEdit?: () => void;
}

export const getDefaultValues = (): ValueTypeFormData => ({
  epicName: '',
  tShirtSize: 'm',
  urgency: { level: 'mid', notes: '' },
  marketImpact: { level: 'mid', notes: '' },
  strategic: { level: 'mid', notes: '' },
  revenue: { level: 'mid', notes: '' },
  cost: { level: 'mid', notes: '' },
  overallConsiderations: '',
});

export function ValueTypeForm({ form, onSubmit, isLoading, isEditing, onCancelEdit }: ValueTypeFormProps) {

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Epic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="epicName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Epic Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Implement New User Dashboard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tShirtSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Shirt className="mr-2 h-4 w-4" /> T-Shirt Size (Effort)
                      </FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a T-shirt size..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="xs">XS (Minimal Effort)</SelectItem>
                          <SelectItem value="s">S (Small Effort)</SelectItem>
                          <SelectItem value="m">M (Medium Effort)</SelectItem>
                          <SelectItem value="l">L (Large Effort)</SelectItem>
                          <SelectItem value="xl">XL (Extra Large Effort)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
        </Card>

        {VALUE_TYPES_CONFIG.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <category.icon className="mr-3 h-6 w-6" />
                {category.label}
              </CardTitle>
              {category.categoryDescription && (
                <CardDescription className="text-muted-foreground pt-1 text-sm">
                  {category.categoryDescription}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`${category.id}.level` as const}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Select Impact Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {category.levelOptions.map((option: LevelOption) => (
                          <FormItem 
                            key={option.value} 
                            className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-secondary/50 transition-colors cursor-pointer [&[data-state=checked]]:bg-primary/10 [&[data-state=checked]]:border-primary"
                          >
                            <FormControl>
                               <RadioGroupItem value={option.value} id={`${category.id}-${option.value}`} />
                            </FormControl>
                            <FormLabel htmlFor={`${category.id}-${option.value}`} className="flex-1 cursor-pointer">
                                <div className="font-medium capitalize">
                                    {option.label}
                                </div>
                                <FormDescription className="text-sm">
                                    {option.description}
                                </FormDescription>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${category.id}.notes` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why such value?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Explain your reasoning...`}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <AlertCircle className="mr-3 h-6 w-6" />
              Impact of Not Doing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="overallConsiderations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Impact of not doing</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe potential consequences..."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {isEditing && (
              <Button type="button" variant="outline" onClick={onCancelEdit} className="w-full">
                Cancel Edit
              </Button>
            )}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Capturing...'}
                </>
              ) : (
                isEditing ? 'Update Assessment' : 'Capture Assessment'
              )}
            </Button>
        </div>

      </form>
    </FormProvider>
  );
}
