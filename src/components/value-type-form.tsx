
"use client";

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { valueTypeFormSchema, type ValueTypeFormData } from './value-type-form-schema';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey, type LevelOption } from '@/config/value-types.tsx';
import type { Assessment } from '@/services/assessment-service';

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
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ValueTypeFormProps {
  onSubmit: (data: ValueTypeFormData) => void;
  isLoading: boolean;
  initialData?: Assessment | null;
  onCancelEdit?: () => void;
}

const getDefaultValues = (): ValueTypeFormData => {
  const defaults: Partial<ValueTypeFormData> = {
      epicName: '',
      tShirtSize: 'm',
  };
  VALUE_TYPES_CONFIG.forEach(category => {
    const categoryKey = category.id as ValueCategoryKey;
    defaults[categoryKey] = {
      level: 'mid', 
      notes: '',
    };
  });
  defaults.overallConsiderations = '';
  return defaults as ValueTypeFormData;
};

export function ValueTypeForm({ onSubmit, isLoading, initialData, onCancelEdit }: ValueTypeFormProps) {
  const form = useForm<ValueTypeFormData>({
    resolver: zodResolver(valueTypeFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset(getDefaultValues());
    }
  }, [initialData, form]);


  const handleFormSubmit = (data: ValueTypeFormData) => {
    onSubmit(data);
    if (!initialData) { // Only reset for new submissions, not edits
        form.reset(getDefaultValues());
    }
  };

  const isEditing = !!initialData;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">

        <Card className="shadow-lg rounded-xl overflow-hidden">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-primary">Epic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="epicName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Epic Name</FormLabel>
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
                      <FormLabel className="text-base font-semibold flex items-center">
                        <Shirt className="mr-2 h-5 w-5" /> T-Shirt Size (Effort)
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
          <Card key={category.id} className="shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-card">
              <CardTitle className="flex items-center text-2xl font-semibold text-primary">
                <category.icon className="mr-3 h-7 w-7" />
                {category.label}
              </CardTitle>
              {category.categoryDescription && (
                <CardDescription className="text-muted-foreground pt-1 text-sm">
                  {category.categoryDescription}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6 pt-2 pb-6 px-6">
              <FormField
                control={form.control}
                name={`${category.id}.level` as const}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold text-foreground">Select Impact Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {category.levelOptions.map((option: LevelOption) => (
                          <FormItem 
                            key={option.value} 
                            className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg shadow-sm hover:bg-secondary/50 transition-colors cursor-pointer data-[state=checked]:bg-primary/10 data-[state=checked]:border-primary"
                          >
                            <FormControl>
                               <RadioGroupItem value={option.value} id={`${category.id}-${option.value}`} />
                            </FormControl>
                            <FormLabel htmlFor={`${category.id}-${option.value}`} className="flex-1 cursor-pointer">
                                <div className="font-medium text-foreground capitalize">
                                    {option.label}
                                </div>
                                <FormDescription className="text-sm text-muted-foreground">
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
                    <FormLabel className="text-base font-semibold text-foreground">Why such value?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Explain your reasoning for ${category.label.toLowerCase()}. Keep this text compact.`}
                        className="resize-y min-h-[100px] bg-background focus:ring-primary focus:border-primary"
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

        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-card">
            <CardTitle className="flex items-center text-2xl font-semibold text-primary">
              <AlertCircle className="mr-3 h-7 w-7" />
              Impact of Not Doing
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-6 px-6">
            <FormField
              control={form.control}
              name="overallConsiderations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Impact of not doing</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe potential consequences. Keep this text compact."
                      className="resize-y min-h-[120px] bg-background focus:ring-primary focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4">
            {isEditing && (
              <Button type="button" variant="outline" onClick={onCancelEdit} className="w-full text-lg py-6 rounded-lg shadow-md">
                Cancel Edit
              </Button>
            )}
            <Button type="submit" className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md focus:ring-2 focus:ring-accent focus:ring-offset-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
