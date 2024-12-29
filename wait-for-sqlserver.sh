#!/bin/bash

# Aguarda o SQL Server estar pronto
until nc -z -v -w30 sqlserver 1433
do
  echo "Aguardando o SQL Server estar pronto..."
  sleep 1
done

echo "SQL Server está pronto! Iniciando o NestJS..."

# Inicia o NestJS
exec "$@"
