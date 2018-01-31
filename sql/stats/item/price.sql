SELECT SUM(stock * price) as price 
FROM candies
WHERE id = $1;