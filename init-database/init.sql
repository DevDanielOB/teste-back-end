IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'teste')
BEGIN
    CREATE DATABASE teste;
END
GO
