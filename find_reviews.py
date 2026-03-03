
import json

keywords = ['downtown', 'high rise', 'high-rise', 'loop', 'elevator', 'apartment', 'condo', 'office', 'chicago']
try:
    with open('reviews.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        reviews = data.get('reviews', [])
except Exception as e:
    print(f"Error reading reviews.json: {e}")
    reviews = []

scored_reviews = []

for r in reviews:
    score = 0
    comment = r.get('comment', '').lower()
    if not comment:
        continue
        
    for k in keywords:
        if k in comment:
            score += 1
            
    # Boost specifically for 'loop', 'high rise', 'downtown'
    if 'loop' in comment: score += 2
    if 'high rise' in comment or 'high-rise' in comment: score += 2
    if 'downtown' in comment: score += 2
    
    if score > 0:
        scored_reviews.append((score, r))

# Sort by score descending
scored_reviews.sort(key=lambda x: x[0], reverse=True)

# Print top 5 results as JSON
results = [r for s, r in scored_reviews[:5]]
print(json.dumps(results, indent=2))
