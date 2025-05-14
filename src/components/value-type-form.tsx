
"use client";

import type * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { valueTypeFormSchema, type ValueTypeFormData } from './value-type-form-schema';
import { VALUE_TYPES_CONFIG, type ValueCategoryKey, type LevelOption } from '@/config/value-types';
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      level: 'mid', 
      notes: '',
    };
  });
  defaults.overallConsiderations = '';
  return defaults as ValueTypeFormData;
};

export function ValueTypeForm({ onSubmit, isLoading }: ValueTypeFormProps) {
  const form = useForm<ValueTypeFormData>({
    resolver: zodResolver(valueTypeFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const handleFormSubmit = (data: ValueTypeFormData) => {
    onSubmit(data as DetermineValueTypeInput);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {VALUE_TYPES_CONFIG.map((category) => (
          <Card key={category.id} className="shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-card">
              <CardTitle className="flex items-center text-2xl font-semibold text-primary">
                <category.icon className="mr-3 h-7 w-7" />
                {category.label}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {category.categoryDescription}
              </CardDescription>
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
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {category.levelOptions.map((option: LevelOption) => (
                          <FormItem 
                            key={option.value} 
                            className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg shadow-sm hover:bg-secondary/50 transition-colors cursor-pointer data-[state=checked]:bg-primary/10 data-[state=checked]:border-primary"
                            onClick={() => field.onChange(option.value)}
                          >
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <div className="flex-1">
                              <FormLabel className="font-medium text-foreground capitalize cursor-pointer">
                                {option.label}
                              </FormLabel>
                              <FormDescription className="text-sm text-muted-foreground">
                                {option.description}
                              </FormDescription>
                            </div>
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
            <CardDescription className="text-muted-foreground">
              What would happen if we don’t work on the epic right now?
            </CardDescription>
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

        <Button type="submit" className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md focus:ring-2 focus:ring-accent focus:ring-offset-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Value Types...
            </>
          ) : (
            'Generate Value Types'
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
