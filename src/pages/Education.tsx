import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User, Eye, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useState } from 'react';

interface EducationArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  readTime: string;
  views: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image: string;
}

const Education = () => {
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(null);

  const articles: EducationArticle[] = [
    {
      id: 1,
      title: "Cara Memisahkan Sampah Plastik yang Benar",
      description: "Pelajari cara yang tepat memisahkan berbagai jenis plastik untuk daur ulang maksimal",
      content: "Pemilahan plastik yang tepat adalah kunci utama dalam proses daur ulang yang efektif. Setiap jenis plastik memiliki karakteristik dan metode daur ulang yang berbeda...",
      category: "Daur Ulang",
      readTime: "5 min",
      views: 234,
      difficulty: 'beginner',
      image: "🔄"
    },
    {
      id: 2,
      title: "Manfaat Kompos Organik untuk Lingkungan",
      description: "Mengapa sampah organik penting dan bagaimana cara mengolahnya menjadi kompos berkualitas",
      content: "Sampah organik seperti sisa makanan, daun, dan material biodegradable lainnya dapat diolah menjadi kompos yang sangat bermanfaat...",
      category: "Kompos",
      readTime: "7 min",
      views: 189,
      difficulty: 'beginner',
      image: "🌱"
    },
    {
      id: 3,
      title: "Kreativitas dengan Barang Bekas",
      description: "Ide kreatif mengubah sampah menjadi barang berguna dan bernilai ekonomi",
      content: "Upcycling adalah teknik mengubah barang bekas menjadi produk yang lebih bernilai. Dengan kreativitas, sampah bisa menjadi karya seni atau produk fungsional...",
      category: "Kreativitas",
      readTime: "10 min",
      views: 156,
      difficulty: 'intermediate',
      image: "♻️"
    },
    {
      id: 4,
      title: "Dampak Positif Daur Ulang pada Ekonomi",
      description: "Bagaimana aktivitas daur ulang dapat menciptakan lapangan kerja dan nilai ekonomi",
      content: "Industri daur ulang tidak hanya memberikan manfaat lingkungan, tetapi juga menciptakan dampak ekonomi yang signifikan...",
      category: "Ekonomi",
      readTime: "8 min",
      views: 98,
      difficulty: 'advanced',
      image: "💰"
    },
    {
      id: 5,
      title: "Mengurangi Jejak Karbon Melalui Daur Ulang",
      description: "Memahami hubungan antara aktivitas daur ulang dan pengurangan emisi karbon",
      content: "Setiap kilogram sampah yang didaur ulang dapat mengurangi emisi CO2 hingga 2.5 kg. Mari pelajari bagaimana cara menghitung dampak positif ini...",
      category: "Lingkungan",
      readTime: "6 min",
      views: 267,
      difficulty: 'intermediate',
      image: "🌍"
    },
    {
      id: 6,
      title: "Teknologi Terbaru dalam Daur Ulang",
      description: "Inovasi teknologi yang mengubah cara kita mendaur ulang sampah",
      content: "Perkembangan teknologi AI, IoT, dan robotika telah merevolusi industri daur ulang dengan efisiensi yang lebih tinggi...",
      category: "Teknologi",
      readTime: "12 min",
      views: 145,
      difficulty: 'advanced',
      image: "🔬"
    }
  ];

  const categories = [...new Set(articles.map(article => article.category))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Pemula';
      case 'intermediate':
        return 'Menengah';
      case 'advanced':
        return 'Lanjutan';
      default:
        return 'Umum';
    }
  };

  if (selectedArticle) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedArticle(null)}
              className="mb-4"
            >
              ← Kembali ke Daftar Artikel
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">{selectedArticle.category}</Badge>
                  <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                    {getDifficultyLabel(selectedArticle.difficulty)}
                  </Badge>
                </div>
                <div className="text-6xl text-center mb-6">{selectedArticle.image}</div>
                <CardTitle className="text-3xl mb-4">{selectedArticle.title}</CardTitle>
                <CardDescription className="text-lg mb-6">{selectedArticle.description}</CardDescription>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {selectedArticle.readTime}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {selectedArticle.views} views
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed">{selectedArticle.content}</p>
                  
                  {/* Placeholder untuk konten artikel yang lebih detail */}
                  <div className="mt-8 space-y-6">
                    <h3 className="text-xl font-semibold">Langkah-langkah Praktis</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Kenali jenis-jenis sampah yang akan diproses</li>
                      <li>Siapkan alat dan tempat pemisahan yang sesuai</li>
                      <li>Lakukan pemisahan dengan teknik yang tepat</li>
                      <li>Simpan hasil pemisahan di tempat yang aman</li>
                      <li>Jadwalkan pickup atau setor ke fasilitas daur ulang</li>
                    </ol>
                    
                    <h3 className="text-xl font-semibold">Tips Tambahan</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Selalu bersihkan sampah sebelum dipisahkan</li>
                      <li>Gunakan sarung tangan saat memilah sampah</li>
                      <li>Pisahkan berdasarkan kategori yang jelas</li>
                      <li>Dokumentasikan proses untuk pembelajaran</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Pusat Edukasi Lingkungan
          </h1>
          <p className="text-gray-600">
            Pelajari tips, trik, dan informasi terbaru tentang daur ulang dan pengelolaan sampah
          </p>
        </div>

        {/* Filter by Category */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Kategori Artikel</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer">Semua</Badge>
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="cursor-pointer">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Artikel Unggulan</h2>
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="text-4xl mb-4">{articles[0].image}</div>
                  <h3 className="text-2xl font-bold mb-2">{articles[0].title}</h3>
                  <p className="text-gray-600 mb-4">{articles[0].description}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className={getDifficultyColor(articles[0].difficulty)}>
                      {getDifficultyLabel(articles[0].difficulty)}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {articles[0].readTime}
                    </div>
                  </div>
                  <Button onClick={() => setSelectedArticle(articles[0])}>
                    Baca Artikel
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-8xl">{articles[0].image}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Articles */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Semua Artikel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card 
                key={article.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {getDifficultyLabel(article.difficulty)}
                    </Badge>
                  </div>
                  <div className="text-4xl text-center mb-4">{article.image}</div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription className="text-sm">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {article.views}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    Baca Selengkapnya
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">
              Bergabunglah dalam Gerakan Lingkungan!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Mulai berkontribusi untuk lingkungan yang lebih bersih dan berkelanjutan
            </p>
            <Button variant="secondary" size="lg">
              Mulai Setor Sampah
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Education;