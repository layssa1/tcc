/**
 * Middleware para rotas inexistentes (404)
 */
export function naoEncontrado(req, res, next) {
  res.status(404).json({
    erro: 'Rota não encontrada.',
    caminho: req.originalUrl,
    metodo: req.method
  });
}

/**
 * Middleware global de tratamento de exceções (500)
 */
export function manipuladorErros(err, req, res, next) {
  console.error('🚨 [Erro na Requisição]:', err);

  const status = err.status || 500;
  res.status(status).json({
    erro: err.message || 'Erro interno no servidor.',
    detalhes: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
