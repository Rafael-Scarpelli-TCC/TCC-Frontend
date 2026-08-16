import { useState, useEffect, useRef } from 'react';
import { importarPlanilha, exportarPlanilha, listarPlanilhas } from '../services/planilhaService.jsx';
import { listarCronogramas } from '../services/cronogramaService.jsx';
import { listarCategorias } from '../services/categoriaService.jsx';
import Button from '../components/ui/Button.jsx';

export default function Admin() {
  const [arquivo, setArquivo] = useState(null);
  const [anoReferencia, setAnoReferencia] = useState('2026');
  const [categoriaId, setCategoriaId] = useState('');
  const [cronogramaId, setCronogramaId] = useState('');
  const [importando, setImportando] = useState(false);
  const [resultadoImportacao, setResultadoImportacao] = useState(null);
  const [planilhas, setPlanilhas] = useState([]);
  const [cronogramas, setCronogramas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [exportando, setExportando] = useState(null);
  const [erro, setErro] = useState('');
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const [resPlanilhas, resCronogramas, resCategorias] = await Promise.all([
        listarPlanilhas(),
        listarCronogramas(),
        listarCategorias(),
      ]);
      setPlanilhas(resPlanilhas.data.planilhas || []);
      setCronogramas(resCronogramas.data.cronogramas || []);
      setCategorias(resCategorias.data.categorias || []);
    } catch (err) {
      console.error('Erro buscarDados:', err.response?.data);
    }
  };

  const handleArquivo = (file) => {
    if (file && file.name.endsWith('.xlsx')) {
      setArquivo(file);
      setErro('');
    } else {
      setErro('Selecione um arquivo .xlsx válido.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastando(false);
    const file = e.dataTransfer.files[0];
    handleArquivo(file);
  };

  const handleImportar = async () => {
    if (!arquivo) return setErro('Selecione um arquivo.');
    try {
      setErro('');
      setImportando(true);
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      formData.append('anoReferencia', anoReferencia);
      if (categoriaId) formData.append('categoriaId', categoriaId);
      if (cronogramaId) formData.append('cronogramaId', cronogramaId);
      const res = await importarPlanilha(formData);
      setResultadoImportacao(res.data);
      setArquivo(null);
      await buscarDados();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao importar planilha.');
    } finally {
      setImportando(false);
    }
  };

  const handleExportar = async (planilhaId, nomeArquivo) => {
    try {
      setErro('');
      setExportando(planilhaId);
      const res = await exportarPlanilha(planilhaId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exportada_${nomeArquivo}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setErro('Erro ao exportar planilha.');
    } finally {
      setExportando(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
          Administração
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text2)' }}>
          Gerencie planilhas e configurações do sistema
        </p>
      </div>

      {erro && (
        <div style={{
          background: 'var(--red-bg)', border: '1px solid var(--red-bd)',
          borderRadius: 'var(--radius)', padding: '10px 14px',
          fontSize: '12px', color: 'var(--red-dk)', marginBottom: '14px',
        }}>
          {erro}
        </div>
      )}

      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '18px', marginBottom: '12px',
      }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>
          Importar Planilha
        </h2>

        <div
          onDragOver={e => { e.preventDefault(); setArrastando(true); }}
          onDragLeave={() => setArrastando(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          style={{
            border: `2px dashed ${arrastando ? 'var(--blue)' : arquivo ? 'var(--green)' : 'var(--border2)'}`,
            borderRadius: 'var(--radius)',
            padding: '32px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            background: arrastando ? 'var(--blue-bg)' : arquivo ? 'var(--green-bg)' : 'var(--bg3)',
            cursor: 'pointer',
            transition: 'all .15s',
            marginBottom: '14px',
          }}
        >
          <svg width="28" height="28" fill="none" stroke={arquivo ? 'var(--green)' : 'var(--text3)'} strokeWidth="1.5" viewBox="0 0 24 24">
            {arquivo
              ? <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13l2 2 4-4" />
              : <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />
            }
          </svg>
          <span style={{ fontSize: '13px', fontWeight: 600, color: arquivo ? 'var(--green-dk)' : 'var(--text)' }}>
            {arquivo ? arquivo.name : 'Arraste o arquivo aqui'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text3)' }}>
            {arquivo ? 'Clique para trocar o arquivo' : 'ou clique para selecionar um arquivo .xlsx'}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={e => handleArquivo(e.target.files[0])}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
              Ano de Referência
            </label>
            <input
              value={anoReferencia}
              onChange={e => setAnoReferencia(e.target.value)}
              style={{
                width: '100%', padding: '7px 10px', fontSize: '12px',
                border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                background: 'var(--bg)', color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
              Categoria
            </label>
            <select
              value={categoriaId}
              onChange={e => setCategoriaId(e.target.value)}
              style={{
                width: '100%', padding: '7px 10px', fontSize: '12px',
                border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                background: 'var(--bg)', color: 'var(--text)',
              }}
            >
              <option value="">Sem categoria</option>
              {categorias.map(c => (
                <option key={c._id} value={c._id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '4px' }}>
              Cronograma
            </label>
            <select
              value={cronogramaId}
              onChange={e => setCronogramaId(e.target.value)}
              style={{
                width: '100%', padding: '7px 10px', fontSize: '12px',
                border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
                background: 'var(--bg)', color: 'var(--text)',
              }}
            >
              <option value="">Sem cronograma</option>
              {cronogramas.map(c => (
                <option key={c._id} value={c._id}>
                  {c.anoReferencia} — {c.status === 'ABERTO' ? 'Aberto' : 'Encerrado'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button variant="primary" onClick={handleImportar} disabled={importando || !arquivo}>
          {importando ? 'Importando...' : 'Importar Planilha'}
        </Button>

        {resultadoImportacao && (
          <div style={{
            marginTop: '12px', background: 'var(--green-bg)',
            border: '1px solid var(--green-bd)', borderRadius: 'var(--radius)',
            padding: '10px 14px', fontSize: '12px', color: 'var(--green-dk)',
          }}>
            ✓ {resultadoImportacao.message} — {resultadoImportacao.totalItens} itens importados.
          </div>
        )}
      </div>

      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '18px',
      }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>
          Planilhas Importadas
        </h2>

        {planilhas.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Nenhuma planilha importada.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {planilhas.map(p => (
              <div key={p._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              }}>
                <svg width="16" height="16" fill="none" stroke="var(--green)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
                    {p.nomeArquivo}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>
                    Ano: {p.anoReferencia}
                    {p.categoria && ` • ${p.categoria.nome}`}
                    {' • '}Importado em: {new Date(p.dataImportacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleExportar(p._id, p.nomeArquivo)}
                  disabled={exportando === p._id}
                >
                  {exportando === p._id ? 'Exportando...' : 'Exportar'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}