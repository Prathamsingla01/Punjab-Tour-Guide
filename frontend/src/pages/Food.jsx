import React, { useState } from 'react';
import { Coffee, Flame, Info, Check, Eye } from 'lucide-react';

const Food = () => {
  const [selectedFood, setSelectedFood] = useState(null);

  const foodsData = [
    {
      id: 1,
      name: 'Amritsari Kulcha',
      description: 'Crisp, layered flatbread stuffed with spiced potatoes and cauliflower, baked in a traditional clay tandoor. Served with tangy chole and dollops of fresh butter.',
      calories: 420,
      history: 'Originated in the royal kitchens of the Mughal Empire and adapted by the bakers of Amritsar, who perfected the crisp layering technique using rich ghee.',
      ingredients: ['Maida (Refined Flour)', 'Potatoes', 'Pomegranate Seeds (Anardana)', 'Green Chilies', 'Butter', 'Ghee'],
      isVeg: true,
      spicyLevel: 2,
      famousAt: 'Kesar Da Dhaba, Amritsar',
      image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=500'
    },
    {
      id: 2,
      name: 'Sarson da Saag & Makki di Roti',
      description: 'Slow-cooked mustard greens blended with spices, served with flatbread made of maize flour. The ultimate winter comfort food of rural Punjab.',
      calories: 320,
      history: 'A traditional peasant dish from Punjab farms, cooked slowly on open wood-fired mud stoves (Chulhas) to retain nutrients and earthy aromas.',
      ingredients: ['Mustard Greens', 'Bathua (Pigweed)', 'Maize Flour', 'Ginger', 'Garlic', 'Jaggery', 'Butter'],
      isVeg: true,
      spicyLevel: 1,
      famousAt: 'Bharawan Da Dhaba, Amritsar',
      image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=500'
    },
    {
      id: 3,
      name: 'Amritsari Lassi',
      description: 'Thick, creamy yogurt drink blended with sugar, cardamoms, and topped with a heavy layer of fresh clotted cream (Malai).',
      calories: 380,
      history: 'Traditional refreshing drink consumed by farmers before starting long days in the sun, served in large brass tumblers.',
      ingredients: ['Fresh Curd', 'Sugar', 'Cardamom Powder', 'Clotted Cream (Malai)', 'Rose Water'],
      isVeg: true,
      spicyLevel: 0,
      famousAt: 'Ahuja Milk Bhandar, Amritsar',
      image: 'https://images.unsplash.com/photo-1546173159-3159b44d989c?q=80&w=500'
    }
  ];

  return (
    <div className="food-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div className="section-header">
        <h1 className="section-title">Culinary Delicacies</h1>
        <p className="section-subtitle">Savor the world-famous rich dishes, fresh tandoori breads, and traditional dhabas of Punjab.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-5)' }}>
        {/* Delicacy list grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {foodsData.map((food) => (
            <div key={food.id} className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <img src={food.image} alt={food.name} style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              <div style={{ flex: '1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 'var(--text-xl)' }}>{food.name}</h3>
                  <span style={{ fontSize: '10px', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', color: food.isVeg ? 'var(--color-green)' : 'var(--color-phulkari-pink)', fontWeight: '600' }}>
                    {food.isVeg ? 'VEGETARIAN' : 'NON-VEG'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: '8px 0' }}>{food.description}</p>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '12px 0' }}>
                  <span style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Info size={12} /> {food.calories} kCal
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={12} color="orange" /> Spicy Level: {food.spicyLevel}/3
                  </span>
                </div>

                <button 
                  onClick={() => setSelectedFood(food)} 
                  className="login-nav-btn" 
                  style={{ padding: '6px 16px', fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Eye size={12} />
                  <span>Recipe Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recipe detail sidebar drawer */}
        <div>
          {selectedFood ? (
            <div className="glass-panel animate-fade-in-up" style={{ padding: 'var(--space-4)', position: 'sticky', top: '90px' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '4px' }}>{selectedFood.name}</h2>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Best experienced at: <strong>{selectedFood.famousAt}</strong></span>
              
              <div style={{ margin: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '600', marginBottom: '4px' }}>History & Tradition</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{selectedFood.history}</p>
              </div>

              <div style={{ margin: 'var(--space-3) 0' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '600', marginBottom: '8px' }}>Key Ingredients</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedFood.ingredients.map((ing, i) => (
                    <span key={i} style={{ fontSize: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={8} color="var(--color-green)" /> {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Coffee size={24} style={{ margin: '0 auto 8px auto', color: 'var(--color-mustard)' }} />
              <h3>Select a Delicacy</h3>
              <p style={{ fontSize: 'var(--text-xs)', marginTop: '4px' }}>Click "Recipe Details" on any dish to view its cultural history, ingredients list, and local kitchen tips.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Food;
