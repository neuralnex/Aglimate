'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Search, Bookmark, BookmarkCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { id: 'crops', name: 'Crops', icon: null, color: 'bg-yellow-50 text-yellow-600' },
  { id: 'livestock', name: 'Livestock', icon: null, color: 'bg-amber-50 text-amber-600' },
  { id: 'soil', name: 'Soil', icon: null, color: 'bg-green-50 text-green-600' },
  { id: 'pests', name: 'Pests & Diseases', icon: null, color: 'bg-red-50 text-red-600' },
  { id: 'weather', name: 'Weather', icon: null, color: 'bg-blue-50 text-blue-600' },
  { id: 'market', name: 'Market', icon: null, color: 'bg-purple-50 text-purple-600' },
]

const ARTICLES = [
  {
    id: '1',
    title: 'Best Practices for Maize Planting in Nigeria',
    excerpt: 'Learn the optimal timing, spacing, and soil preparation techniques for high-yield maize farming across Nigerian agro-ecological zones.',
    category: 'crops',
    subcategory: 'maize',
    readTime: 5,
    language: 'en',
    saved: false,
  },
  {
    id: '2',
    title: 'Cassava Disease Identification Guide',
    excerpt: 'Visual guide to identifying common cassava diseases including cassava mosaic disease and brown streak disease.',
    category: 'pests',
    subcategory: 'cassava',
    readTime: 8,
    language: 'en',
    saved: true,
  },
  {
    id: '3',
    title: 'Preparing for the Rainy Season',
    excerpt: 'Essential steps to protect your farm and maximize yields during Nigeria\'s rainy season.',
    category: 'weather',
    subcategory: 'seasonal',
    readTime: 4,
    language: 'en',
    saved: false,
  },
  {
    id: '4',
    title: 'Organic Fertilizer Techniques',
    excerpt: 'How to create and apply organic fertilizers using locally available materials.',
    category: 'soil',
    subcategory: 'fertilizer',
    readTime: 6,
    language: 'en',
    saved: false,
  },
]

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set(['2']))

  const toggleSaved = (id: string) => {
    setSavedArticles(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      <h1 className="text-xl sm:text-2xl font-bold text-text">Knowledge Base</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
        <Input
          placeholder="Search articles, crops, diseases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-base"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0',
            !selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
          )}
        >
          All Topics
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0',
              selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filteredArticles.map(article => (
          <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="h-3 w-3" />
                      {article.readTime} min
                    </span>
                  </div>
                  <h3 className="font-semibold text-text mb-2 text-base sm:text-lg">{article.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2 sm:line-clamp-3">{article.excerpt}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSaved(article.id) }}
                  className="shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px]"
                  aria-label={savedArticles.has(article.id) ? 'Remove from saved' : 'Save article'}
                >
                  {savedArticles.has(article.id) ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5 text-text-muted" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
