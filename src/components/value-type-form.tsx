"use client";

import type * as React from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { valueTypeFormSchema, type ValueTypeFormData } from './value-type-form-schema';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey, type ValueLevel, type ChecklistItemDefinition } from '@/config/value-types';
import type { DetermineValueTypeInput } from '@/ai/flows/determine-value-type';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ValueTypeFormProps {
  onSubmit: (data: DetermineValueTypeInput) => Promise<void>;
  isLoading: boolean;
}

const getDefaultValues = (): ValueTypeFormData => {
  const defaults: Partial<ValueTypeFormData> = {};
  VALUE_TYPES_CONFIG.forEach(category => {
    const categoryKey = category.id as ValueCategoryKey;
    defaults[categoryKey] = {
      high: {
        checklist: category.levels.high.defaultChecklistItems.map(item => ({ label: item.label, checked: false })),
        text: '',
      },
      mid: {
        checklist: category.levels.mid.defaultChecklistItems.map(item => ({ label: item.label, checked: false })),
        text: '',
      },
      low: {
        checklist: category.levels.low.defaultChecklistItems.map(item => ({ label: item.label, checked: false })),
        text: '',
      },
    };
  });
  defaults.overallConsiderations = '';
  return defaults as ValueTypeFormData;
};


export function ValueTypeForm({ onSubmit, isLoading }: ValueTypeFormProps) {
  const form = useForm<ValueTypeFormData>({
    resolver: zodResolver(valueTypeFormSchema),
    defaultValues: getDefaultValues(),
  });

  const handleFormSubmit = (data: ValueTypeFormData) => {
    // Transform data to match DetermineValueTypeInput if necessary (already aligned)
    onSubmit(data as DetermineValueTypeInput);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {VALUE_TYPES_CONFIG.map((category) => (
          <Card key={category.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-semibold">
                <category.icon className="mr-3 h-7 w-7 text-primary" />
                {category.label}
              </CardTitle>
              <CardDescription>
                Define the characteristics for {category.label.toLowerCase()}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="high" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  {(['high', 'mid', 'low'] as ValueLevel[]).map(level => (
                    <TabsTrigger key={level} value={level} className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      {level} Impact
                    </TabsTrigger>
                  ))}
                </TabsList>
                {(['high', 'mid', 'low'] as ValueLevel[]).map(level => (
                  <TabsContent key={level} value={level}>
                    <div className="space-y-6 p-1">
                      <p className="text-sm text-muted-foreground">{category.levels[level].description}</p>
                      <div className="space-y-3">
                        <FormLabel className="text-base font-medium">Checklist</FormLabel>
                        {category.levels[level].defaultChecklistItems.map((item, index) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name={`${category.id}.${level}.checklist.${index}.checked` as any}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-background hover:bg-secondary/80 transition-colors">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm text-foreground cursor-pointer flex-grow">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                       <FormField
                        control={form.control}
                        name={`${category.id}.${level}.text` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Specific details for ${level} impact regarding ${category.label.toLowerCase()}...`}
                                className="resize-y min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ))}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-semibold">
              <AlertCircle className="mr-3 h-7 w-7 text-primary" />
              Overall Considerations
            </CardTitle>
            <CardDescription>
              Describe the potential consequences if this epic is not addressed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="overallConsiderations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Overall Considerations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What would happen if we don’t work on the epic right now?"
                      className="resize-y min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Value Types'
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
