import Card from './components/Card'
import SearchInput from './components/searchinput'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function App() {
  const [usuarios, setUsuarios] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

  const obtenerUsuarios = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3001/usuarios')
      setUsuarios(response.data)
      setFiltrados(response.data)
      setError(null)
    } catch (err) {
      setError('Error al cargar usuarios')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  const filtrarUsuarios = useCallback((query) => {
    setLoading(true)
    setTimeout(() => {
      const q = query.trim().toLowerCase()
      const resultados = usuarios.filter(usuario =>
        [usuario.nombre, usuario.apellidos, usuario.perfil, usuario.intereses, usuario.correo].some(campo =>
          String(campo).toLowerCase().includes(q)
        )
      )
      setFiltrados(resultados)
      setLoading(false)
    }, 500)
  }, [usuarios])

  return (
    <div className="p-4 max-w-3xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4 text-center">BUSCADOR DE USUARIOS</h1>

      <SearchInput onSearch={filtrarUsuarios} />

      {loading && (
        <div className="flex flex-col items-center mt-6">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-blue-500 font-semibold">Cargando usuarios...</p>
        </div>
      )}

      {error && (
        <div className="text-center mt-4 text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && filtrados.length === 0 && (
        <div className="text-center mt-4 text-gray-500">
          No se encontraron usuarios.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {!loading && !error && filtrados.map(usuario => (
          <div key={usuario.id} onClick={() => setUsuarioSeleccionado(usuario)}>
            <Card usuario={usuario} />
          </div>
        ))}
      </div>

      {usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full relative">
            <button
              onClick={() => setUsuarioSeleccionado(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>
            <img
              className="w-24 h-24 rounded-full mx-auto mb-4"
              src={usuarioSeleccionado.foto}
              alt={usuarioSeleccionado.nombre}
            />
            <h2 className="text-xl font-semibold text-center">
              {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellidos}
            </h2>
            <p className="text-center text-gray-600 mt-2">{usuarioSeleccionado.perfil}</p>
            <p className="text-center text-sm mt-1 italic">{usuarioSeleccionado.intereses}</p>
            <p className="text-center text-sm text-blue-500 mt-1">{usuarioSeleccionado.correo}</p>
          </div>
        </div>
      )}
    </div>
  )
}
