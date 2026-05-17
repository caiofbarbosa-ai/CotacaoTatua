import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configurações
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://spunhqjwlooktyvrleef.supabase.co'
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdW5ocWp3bG9va3R5dnJsZWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjM3MzEsImV4cCI6MjA5MzM5OTczMX0.Df5dFmacPRfJxdQUtP5y0hnnmufZoNbzkp3N1gAhoPI'
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_YOUR_API_KEY_HERE'
const RESEND_FROM_EMAIL = 'cotacoes@tatua.com.br'
const REMINDER_EMAIL = 'tattootatua@gmail.com'

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Função para buscar cotações com 60 dias
async function buscarCotacoes60Dias() {
  const { data, error } = await supabase.rpc('buscar_cotacoes_60_dias')

  if (error) {
    throw new Error(`Erro ao buscar cotações: ${error.message}`)
  }

  return data || []
}

// Função para formatar data
function formatarData(dataStr: string): string {
  const data = new Date(dataStr)
  return data.toLocaleDateString('pt-BR')
}

// Função para formatar moeda
function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Função para formatar o email HTML
function formatarEmailLembrete(cotacoes: any[]): string {
  if (cotacoes.length === 0) {
    return ''
  }

  const dataHoje = new Date().toLocaleDateString('pt-BR')

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .cotacao-item { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .cotacao-item h3 { margin: 0 0 10px 0; color: #667eea; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { font-weight: bold; width: 120px; color: #555; }
        .info-value { flex: 1; }
        .whatsapp-btn { display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 25px; margin-top: 15px; font-weight: bold; }
        .whatsapp-btn:hover { background: #128C7E; }
        .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
        .preco { color: #28a745; font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Lembretes de Cotações</h1>
          <p>Eventos com 60 dias para acontecer</p>
        </div>
        <div class="content">
          <p>Olá! Encontramos <strong>${cotacoes.length} cotação(ões)</strong> com 60 dias para o evento:</p>
  `

  cotacoes.forEach((c) => {
    const dataFormatada = formatarData(c.data_evento)
    const pricePB = c.price_pb ? formatarMoeda(c.price_pb) : 'N/A'
    const priceColorido = c.price_colorido ? formatarMoeda(c.price_colorido) : 'N/A'

    html += `
      <div class="cotacao-item">
        <h3>📋 ${c.codigo_cotacao}</h3>
        <div class="info-row">
          <span class="info-label">Cliente:</span>
          <span class="info-value">${c.nome || 'Não informado'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Telefone:</span>
          <span class="info-value">${c.telefone || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Cidade:</span>
          <span class="info-value">${c.cidade}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data Evento:</span>
          <span class="info-value">${dataFormatada}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tempo Ação:</span>
          <span class="info-value">${c.action_time} horas</span>
        </div>
        <div class="info-row">
          <span class="info-label">Preços:</span>
          <span class="info-value">
            PB: <span class="preco">${pricePB}</span> |
            Colorido: <span class="preco">${priceColorido}</span>
          </span>
        </div>
        <a href="${c.whatsapp_link}" class="whatsapp-btn" target="_blank">
          💬 Contatar no WhatsApp
        </a>
      </div>
    `
  })

  html += `
          <div class="footer">
            <p>Enviado automaticamente pelo Sistema de Cotação Tatuá</p>
            <p>Data: ${dataHoje}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return html
}

// Função para enviar email via Resend
async function enviarEmailLembrete(html: string) {
  if (RESEND_API_KEY === 're_YOUR_API_KEY_HERE') {
    throw new Error('API Key do Resend não configurada')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: REMINDER_EMAIL,
      subject: `📅 Lembretes de Cotações - ${new Date().toLocaleDateString('pt-BR')}`,
      html: html
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Erro ao enviar email: ${errorData.message || response.status}`)
  }

  return await response.json()
}

// Handler principal
serve(async (req) => {
  try {
    console.log('Iniciando envio de lembretes...')

    // Buscar cotações com 60 dias
    const cotacoes = await buscarCotacoes60Dias()
    console.log(`Encontradas ${cotacoes.length} cotação(ões)`)

    if (cotacoes.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'Nenhuma cotação encontrada', cotacoes: [] }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Formatar email
    const html = formatarEmailLembrete(cotacoes)

    if (!html) {
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao formatar email' }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Enviar email
    const emailResult = await enviarEmailLembrete(html)
    console.log('Email enviado com sucesso:', emailResult)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email enviado com sucesso! ${cotacoes.length} cotação(ões) processada(s).`,
        cotacoes: cotacoes
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Erro ao executar lembrete:', error)
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
