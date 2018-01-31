UPDATE candies 
SET description = $2, cost = $3, price = $4, stock = $5
WHERE id = $1;