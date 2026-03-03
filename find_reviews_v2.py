
import json

keywords = ['view', 'floor', 'building', 'doorman', 'freight', 'dock', 'loop']
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
    
    if score > 0:
        scored_reviews.append((score, r))

scored_reviews.sort(key=lambda x: x[0], reverse=True)

results = [r for s, r in scored_reviews[:5]]
print(json.dumps(results, indent=2))
