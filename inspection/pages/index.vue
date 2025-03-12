<template>
  <div class="container mx-auto py-10">
    <Card class="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Property Inspection System</CardTitle>
        <CardDescription>Welcome to the property inspection management system</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4">
          <NuxtLink to="/inspection">
            <Button class="w-full">Create New Inspection</Button>
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>