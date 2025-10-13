import { useState, useEffect } from 'react';
import { Quote } from '@/types/board';
import { loadBoardData, updateQuotes } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const QuoteManager = () => {
  const [quotes, setQuotes] = useState<Quote[]>(loadBoardData().quotes || []);
  const [newQuote, setNewQuote] = useState<Partial<Quote>>({
    type: 'quote',
    text: '',
    source: '',
  });


  // Açılışta güncel veriyi çek
  useEffect(() => {
    (async () => {
      const data = await loadBoardData();
      setQuotes(data.quotes || []);
    })();
  }, []);

  const handleAdd = async () => {
    if (!newQuote.text?.trim()) {
      toast.error('Lütfen metin giriniz');
      return;
    }
    
    const quote: Quote = {
      id: `q${Date.now()}`,
      type: newQuote.type as 'verse' | 'hadith' | 'quote',
      text: newQuote.text,
      source: newQuote.source || undefined,
    };

    const updated = [...quotes, quote];
    setQuotes(updated);
    setNewQuote({ type: 'quote', text: '', source: '' });
    try {
      await updateQuotes(updated);
      toast.success('Söz eklendi ve kaydedildi');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Söz kaydedilemedi');
    }
  };

  const handleDelete = async (id: string) => {
    const updated = quotes.filter(q => q.id !== id);
    setQuotes(updated);
    try {
      await updateQuotes(updated);
      toast.success('Söz silindi ve kaydedildi');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Söz kaydedilemedi');
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'verse': return 'Ayet';
      case 'hadith': return 'Hadis';
      case 'quote': return 'Özlü Söz';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ayet, Hadis ve Özlü Söz Yönetimi</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Ekle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tür</Label>
            <Select 
              value={newQuote.type} 
              onValueChange={(value) => setNewQuote({ ...newQuote, type: value as Quote['type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verse">Ayet</SelectItem>
                <SelectItem value="hadith">Hadis</SelectItem>
                <SelectItem value="quote">Özlü Söz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Metin</Label>
            <Textarea
              value={newQuote.text}
              onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
              placeholder="Söz metnini girin..."
              rows={3}
            />
          </div>

          <div>
            <Label>Kaynak (Opsiyonel)</Label>
            <Input
              value={newQuote.source}
              onChange={(e) => setNewQuote({ ...newQuote, source: e.target.value })}
              placeholder="Kaynak bilgisi (örn: Bakara Suresi 2:44)"
            />
          </div>

          <Button onClick={handleAdd} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Ekle
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mevcut Sözler ({quotes.length})</h3>
        {quotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Henüz söz eklenmemiş
            </CardContent>
          </Card>
        ) : (
          quotes.map((quote) => (
            <Card key={quote.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded">
                        {getTypeLabel(quote.type)}
                      </span>
                    </div>
                    <p className="text-sm mb-2 italic">"{quote.text}"</p>
                    {quote.source && (
                      <p className="text-xs text-muted-foreground">— {quote.source}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(quote.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
