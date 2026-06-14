import { useState } from 'react'
import './App.css'

interface Endereco {
  cep: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  estado: string
}

const enderecoInicial: Endereco = {
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
}

function formatarCep(valor: string): string {
  const apenasNumeros = valor.replace(/\D/g, '')
  if (apenasNumeros.length <= 5) return apenasNumeros
  return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`
}

function App() {
  const [endereco, setEndereco] = useState<Endereco>(enderecoInicial)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cepFormatado = formatarCep(e.target.value)
    setEndereco((prev) => ({ ...prev, cep: cepFormatado }))
    setErro('')

    const apenasNumeros = cepFormatado.replace(/\D/g, '')
    if (apenasNumeros.length === 8) {
      buscarCep(apenasNumeros)
    }
  }

  const buscarCep = async (cepNumeros: string) => {
    setCarregando(true)
    setErro('')

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
      const data = await response.json()

      if (data.erro) {
        setErro('CEP não encontrado.')
      } else {
        setEndereco((prev) => ({
          ...prev,
          cep: formatarCep(data.cep),
          rua: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }))
      }
    } catch {
      setErro('Erro ao buscar o CEP. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Formulário enviado!\n' + JSON.stringify(endereco, null, 2))
  }

  const handleLimpar = () => {
    setEndereco(enderecoInicial)
    setErro('')
  }

  const atualizarCampo = (campo: keyof Endereco, valor: string) => {
    setEndereco((prev) => ({ ...prev, [campo]: valor }))
  }

  return (
    <main className="container">
      <h1>Consulta de CEP</h1>
      <p className="subtitulo">Digite o CEP para preencher o endereço automaticamente.</p>

      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo">
          <label htmlFor="cep">CEP</label>
          <input
            id="cep"
            type="text"
            value={endereco.cep}
            onChange={handleCepChange}
            placeholder="00000-000"
            maxLength={9}
            autoFocus
          />
          {carregando && <span className="info">Buscando...</span>}
          {erro && <span className="erro">{erro}</span>}
        </div>

        <div className="linha-dupla">
          <div className="campo">
            <label htmlFor="rua">Rua</label>
            <input
              id="rua"
              type="text"
              value={endereco.rua}
              onChange={(e) => atualizarCampo('rua', e.target.value)}
              placeholder="Rua"
            />
          </div>

          <div className="campo campo-numero">
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              type="text"
              value={endereco.numero}
              onChange={(e) => atualizarCampo('numero', e.target.value)}
              placeholder="Número"
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="bairro">Bairro</label>
          <input
            id="bairro"
            type="text"
            value={endereco.bairro}
            onChange={(e) => atualizarCampo('bairro', e.target.value)}
            placeholder="Bairro"
          />
        </div>

        <div className="linha-dupla">
          <div className="campo">
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              type="text"
              value={endereco.cidade}
              onChange={(e) => atualizarCampo('cidade', e.target.value)}
              placeholder="Cidade"
            />
          </div>

          <div className="campo campo-estado">
            <label htmlFor="estado">Estado</label>
            <input
              id="estado"
              type="text"
              value={endereco.estado}
              onChange={(e) => atualizarCampo('estado', e.target.value)}
              placeholder="UF"
              maxLength={2}
            />
          </div>
        </div>

        <div className="botoes">
          <button type="submit" className="btn-primario">
            Enviar
          </button>
          <button type="button" className="btn-secundario" onClick={handleLimpar}>
            Limpar
          </button>
        </div>
      </form>
    </main>
  )
}

export default App
