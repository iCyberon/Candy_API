SELECT SUM(stock * cost) as cost 
FROM candies
WHERE id = $1;