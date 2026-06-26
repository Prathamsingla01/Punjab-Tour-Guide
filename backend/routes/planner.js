import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Generate customized itineraries matching user criteria
router.post('/generate', (req, res) => {
  // Use res directly since we need to reply
  const { days, budget, travelStyle, hasKids, hasSeniors, transport } = req.body;

  if (!days || !budget || !travelStyle) {
    return res.status(400).json({ message: 'Missing itinerary parameters.' });
  }

  // Pre-configured dynamic schedule templates mapped to style and duration
  const scheduleMatrix = {
    'Religious': {
      1: {
        morning: 'Vigorous spiritual morning walk around Golden Temple complex, listening to sacred chants.',
        afternoon: 'Enjoying langar service at Sri Harmandir Sahib followed by a historical walk at Jallianwala Bagh.',
        evening: 'Witness the serene Palki Sahib ceremony inside the Golden Temple sanctum.'
      },
      2: {
        morning: 'Visit Gurudwara Baba Atal Rai and local spiritual heritage markets.',
        afternoon: 'Travel to Anandpur Sahib. Explore historical battle narratives.',
        evening: 'Peaceful sunset walk around Takht Sri Keshgarh Sahib.'
      },
      3: {
        morning: 'Drive to Bathinda. Visit Takht Sri Damdama Sahib.',
        afternoon: 'Taste traditional Sarson da Saag at rural local dhabas.',
        evening: 'Sunset reflections at Bathinda Lakes.'
      }
    },
    'History': {
      1: {
        morning: 'Explore Gobindgarh Fort museums and interactive weapons showcases.',
        afternoon: 'Jallianwala Bagh memorial walk and Martyr gallery inspection.',
        evening: 'Partition Museum visiting session on historical refugee testimonies.'
      },
      2: {
        morning: 'Travel to Patiala. Explore the massive royal mud fortress Qila Mubarak.',
        afternoon: 'Inspect the glittering crystal mirrors of Sheesh Mahal.',
        evening: 'Stroll in the historic lawns of Baradari Gardens.'
      },
      3: {
        morning: 'Visit Jagatjit Palace in Kapurthala, built on French designs.',
        afternoon: 'Explore the Moorish Mosque of Kapurthala.',
        evening: 'Evening heritage walk in local Kapurthala bazaars.'
      }
    }
  };

  // Fallback to History if style isn't coded
  const selectedTimeline = scheduleMatrix[travelStyle] || scheduleMatrix['History'];
  const generatedTimeline = {};
  
  for (let i = 1; i <= days; i++) {
    generatedTimeline[i] = selectedTimeline[i] || {
      morning: 'Scenic walk around rural farmlands, observing local wheat harvests.',
      afternoon: 'Feast on slow-cooked makki roti and fresh lassi at highway dhabas.',
      evening: 'Watch traditional folk music and instruments in nearby village centers.'
    };
  }

  const packingList = ['Comfortable walking shoes', 'Modest head covering scarf', 'Cash for rural markets'];
  if (hasKids) packingList.push('Stroller, kid-friendly snack packs, hydration fluids');
  if (hasSeniors) packingList.push('Special medicines, lightweight folding seats');

  const baseRate = budget === 'Budget' ? 2500 : budget === 'Mid' ? 6000 : 15000;
  const totalCost = days * baseRate;

  // Retrieve matching hotels/restaurants from DB to recommend
  db.all('SELECT name, price_per_night FROM hotels ORDER BY rating DESC LIMIT 2', [], (err, hotels) => {
    const recommendedHotels = (hotels || []).map(h => `${h.name} (₹${h.price_per_night})`).join(' or ');
    
    res.status(200).json({
      timeline: generatedTimeline,
      cost: totalCost,
      packing: packingList,
      distance: `${days * 120} km`,
      hotel: recommendedHotels || 'Premium local homestays',
      restaurant: 'Kesar Da Dhaba, Pal Dhaba',
      emergency: 'Punjab Tourist Police SOS Hotline: 1800-180-2111'
    });
  });
});

export default router;
