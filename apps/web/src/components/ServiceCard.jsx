import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function ServiceCard({ title, description, icon: Icon, image, featured = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${
        featured ? 'border-2 border-primary' : 'hover:-translate-y-1'
      }`}>

        {image ? (
          /* Imagem com título em overlay — estilo editorial */
          <div className="relative w-full aspect-[4/3] overflow-hidden shrink-0">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <CardTitle className="display-font text-xl md:text-2xl text-white leading-snug">
                {title}
              </CardTitle>
            </div>
          </div>
        ) : (
          /* Sem imagem — ícone + título padrão */
          <CardHeader>
            {Icon && (
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
        )}

        <CardContent className={`flex-1 flex flex-col ${image ? 'pt-5' : ''}`}>
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
