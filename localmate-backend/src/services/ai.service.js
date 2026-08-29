const axios = require('axios');
const Location = require('../models/Location');

const getRecommendations = async (preferences, city = null) => {
  const query = { isActive: true };
  if (city) query.city = new RegExp(city, 'i');

  const locations = await Location.find(query)
    .limit(50)
    .select('name category priceRange city tags _id description')
    .lean();

  if (locations.length === 0) {
    return { recommendations: [] };
  }

  const locationsContext = JSON.stringify(
    locations.map(l => ({
      id: l._id,
      name: l.name,
      category: l.category,
      price_range: l.priceRange,
      city: l.city,
      tags: l.tags || []
    }))
  );

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        system: `You are an expert Vietnam travel consultant with 10 years experience.
                 Respond with VALID JSON ONLY. No markdown, no extra text.
                 Only recommend locations from the provided list.
                 Never invent locations not in the list.`,
        messages: [{
          role: 'user',
          content: `Tourist preferences: "${preferences}"
                    
                    Available locations in our database:
                    ${locationsContext}
                    
                    Return this exact JSON format:
                    {
                      "recommendations": [
                        {
                          "location_id": "mongodb_id_string",
                          "name": "location name",
                          "reason": "why this matches preferences in 2 sentences",
                          "category": "CULTURE|FOOD|NATURE|SHOPPING|ENTERTAINMENT|RELIGIOUS",
                          "estimated_cost": "FREE|BUDGET|MODERATE|EXPENSIVE",
                          "best_time": "best time to visit"
                        }
                      ]
                    }
                    Return 5 to 8 recommendations ordered by best match.`
        }]
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 30000
      }
    );

    const text = response.data.content[0].text;
    const result = JSON.parse(text);
    return result;
  } catch (err) {
    console.error('AI service error:', err.message);
    // Fallback: return top rated locations
    return {
      recommendations: locations.slice(0, 5).map(l => ({
        location_id: l._id,
        name: l.name,
        reason: 'Popular destination in Vietnam, highly recommended.',
        category: l.category,
        estimated_cost: l.priceRange,
        best_time: 'Morning or late afternoon'
      }))
    };
  }
};

module.exports = { getRecommendations };
