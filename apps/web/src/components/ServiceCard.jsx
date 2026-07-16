import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function ServiceCard({ title, description, icon: Icon, image, featured = false, delay = 0, naturalWidth = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={naturalWidth ? '' : 'h-full'}
    >
      <Card className={`flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${
        naturalWidth ? 'w-fit min-w-[220px]' : 'h-full'
      } ${featured ? 'border-2 border-primary' : 'hover:-translate-y-1'}`}>

        {image && (
          <div className={`self-start flex justify-center items-center overflow-hidden shrink-0 py-4 bg-muted/10 ${
            naturalWidth ? '' : 'w-full'
          }`}>
            <img
              src={image}
              alt={title}
              className="max-h-72 w-auto block transition-transform duration-700 hover:scale-105"
            />
          </div>
        )}

        <CardHeader className={image ? 'pt-4' : ''}>
          {Icon && !image && (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              featured ? 'bg-primary text-primary-foreground' : 'bg-accent/10 text-accent'
            }`}>
              <Icon className="h-6 w-6" />
            </div>
          )}
          <CardTitle className="heading-font text-xl md:text-2xl text-foreground">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <CardDescription className="leading-relaxed mb-8 flex-1 text-muted-foreground text-base">
            {description}
          </CardDescription>
          <div className="mt-auto">
            <Button
              variant={featured ? 'default' : 'outline'}
              className="w-full group transition-all duration-200"
            >
              Saiba mais
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ServiceCard;
