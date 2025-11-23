-- Migration: Update product images with Unsplash photos
-- Created: 2025-11-23
-- Description: Add real product images from Unsplash to all products

-- 전자제품 (Electronics)
UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1566355800052-c1fff02fcbae?w=800',
  'https://images.unsplash.com/photo-1723961617032-ef69c454cb31?w=800',
  'https://images.unsplash.com/photo-1614480909030-bda0898900a0?w=800',
  'https://images.unsplash.com/photo-1673854624283-7a7ca8f1150f?w=800'
]
WHERE name = '무선 블루투스 이어폰';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1697490057407-34c996cab84f?w=800',
  'https://images.unsplash.com/photo-1575054092299-4a300e7a2511?w=800',
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800',
  'https://images.unsplash.com/photo-1627040816517-2dc5a0130c2e?w=800'
]
WHERE name = '스마트워치 프로';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1751423651331-04cbfb92eb42?w=800',
  'https://images.unsplash.com/photo-1698913461025-d37b0f82ec69?w=800',
  'https://images.unsplash.com/photo-1593259037198-c720f4420d7f?w=800',
  'https://images.unsplash.com/photo-1706275399728-da031110dc43?w=800'
]
WHERE name = '휴대용 보조배터리 20000mAh';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1694175640153-00c83f4a36ef?w=800',
  'https://images.unsplash.com/photo-1722437697582-18710e8ebda9?w=800',
  'https://images.unsplash.com/photo-1710934443296-d00b8c78110e?w=800'
]
WHERE name = '무선 마우스';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1651530065437-9d961dc5e8d9?w=800',
  'https://images.unsplash.com/photo-1633157546962-9bcc366ab21d?w=800',
  'https://images.unsplash.com/photo-1640608780384-e5d42788402d?w=800',
  'https://images.unsplash.com/photo-1679604420507-8b179654c52f?w=800'
]
WHERE name = 'USB-C 멀티 허브';

-- 의류 (Clothing)
UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1621951833860-c1ceea369593?w=800',
  'https://images.unsplash.com/photo-1669791777784-dddd07abc8a5?w=800',
  'https://images.unsplash.com/photo-1636831990771-c70381797936?w=800',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
]
WHERE name = '면 100% 기본 티셔츠';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1661110546899-732bffb4cb85?w=800',
  'https://images.unsplash.com/photo-1621359796075-266f01dddf1a?w=800',
  'https://images.unsplash.com/photo-1592878849122-facb97520f9e?w=800',
  'https://images.unsplash.com/photo-1697289462507-1f133d023277?w=800'
]
WHERE name = '후드 집업 자켓';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1718252540511-e958742e4165?w=800',
  'https://images.unsplash.com/photo-1718252540617-6ecda2b56b57?w=800',
  'https://images.unsplash.com/photo-1718252540558-7b383b52642e?w=800',
  'https://images.unsplash.com/photo-1718252540585-499e23ef57a2?w=800'
]
WHERE name = '청바지 슬림핏';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1667900334692-0bf6afe68cbf?w=800',
  'https://images.unsplash.com/photo-1627778684736-9e2611bfe6ce?w=800',
  'https://images.unsplash.com/photo-1589636279071-23150d8fd33e?w=800'
]
WHERE name = '운동용 레깅스';

-- 도서 (Books)
UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1542395765-761de4ee9696?w=800',
  'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800',
  'https://images.unsplash.com/photo-1586244346400-7ec57cda0c8b?w=800'
]
WHERE name = '클린 코드';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800',
  'https://images.unsplash.com/photo-1550483513-b4fd222ce32e?w=800',
  'https://images.unsplash.com/photo-1542395765-761de4ee9696?w=800'
]
WHERE name = '이펙티브 타입스크립트';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1586244346400-7ec57cda0c8b?w=800',
  'https://images.unsplash.com/photo-1550483513-b4fd222ce32e?w=800',
  'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800'
]
WHERE name = 'HTTP 완벽 가이드';

-- 식품 (Food)
UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1649777536625-8fe182eb37cb?w=800',
  'https://images.unsplash.com/photo-1743356629215-abb470447e71?w=800',
  'https://images.unsplash.com/photo-1668419431630-b823d3261d82?w=800',
  'https://images.unsplash.com/photo-1598811465492-4138d1f4fbee?w=800'
]
WHERE name = '프리미엄 원두 커피 1kg';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1617175093868-ae0d5004881d?w=800',
  'https://images.unsplash.com/photo-1617175093903-1298b4985fcd?w=800',
  'https://images.unsplash.com/photo-1617175093766-18ed657a5c33?w=800',
  'https://images.unsplash.com/photo-1617175093792-30a13225201f?w=800'
]
WHERE name = '유기농 아몬드 500g';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1668780022214-e82d9b67f847?w=800',
  'https://images.unsplash.com/photo-1707830637536-5a935085586c?w=800',
  'https://images.unsplash.com/photo-1670078357048-efe081c86aba?w=800'
]
WHERE name = '올리브 오일 엑스트라 버진';

-- 스포츠 (Sports)
UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1728498852323-6b91113f9111?w=800',
  'https://images.unsplash.com/photo-1582106316415-d02d4d0e9066?w=800',
  'https://images.unsplash.com/photo-1552286450-4a669f880062?w=800',
  'https://images.unsplash.com/photo-1585154536515-c766bd2a6cdc?w=800'
]
WHERE name = '요가 매트 10mm';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1724763750965-e61e1fe6a540?w=800',
  'https://images.unsplash.com/photo-1733517301178-312a6f694f2d?w=800',
  'https://images.unsplash.com/photo-1724763750864-9e81ee45d036?w=800',
  'https://images.unsplash.com/photo-1652364690376-db27a1965bc0?w=800'
]
WHERE name = '덤벨 세트 10kg';

-- 뷰티 (Beauty)
UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1745159338135-39f6b462b382?w=800',
  'https://images.unsplash.com/photo-1648712789552-a039336cecf9?w=800',
  'https://images.unsplash.com/photo-1714980716170-64cae2744604?w=800',
  'https://images.unsplash.com/photo-1648712787765-82c244f76a1d?w=800'
]
WHERE name = '비타민C 세럼 30ml';

UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1738721798337-1c0036181229?w=800',
  'https://images.unsplash.com/photo-1760488029475-41ff1eaa904b?w=800',
  'https://images.unsplash.com/photo-1642501777289-b67ef0ed7b99?w=800',
  'https://images.unsplash.com/photo-1692873844829-fb3b604dd809?w=800'
]
WHERE name = '선크림 SPF50+ PA++++';

-- 생활/가정 (Home)
UPDATE products 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1633121929642-13ddb3cf7599?w=800',
  'https://images.unsplash.com/photo-1636410515418-bbec95c35053?w=800',
  'https://images.unsplash.com/photo-1627894005682-166e8687356a?w=800'
]
WHERE name = '디퓨저 세트';

-- 업데이트 결과 확인 (선택적)
-- SELECT name, array_length(images, 1) as image_count 
-- FROM products 
-- WHERE images IS NOT NULL 
-- ORDER BY category, name;

