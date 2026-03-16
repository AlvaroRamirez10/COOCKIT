import { useEffect, useState, startTransition } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRecetas } from '../hooks/useApiRecetas';
import { traducirBusqueda, traducirTituloReceta, traducirTermino } from '../utils/traduccion';

export default function BarraBusqueda({ onCerrar }) {
	const navigate = useNavigate();
	const [query, setQuery] = useState('');
	const [resultados, setResultados] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [traduciendo, setTraduciendo] = useState(false);

	useEffect(() => {
		const termino = query.trim();

		if (termino.length < 2) {
			startTransition(() => {
				setResultados([]);
				setCargando(false);
				setTraduciendo(false);
			});
			return;
		}

		let activo = true;
		startTransition(() => setCargando(true));

		const timer = setTimeout(async () => {
			try {
				// Traducir el término ES→EN para que la API pueda encontrar resultados
				const terminoEn = await traducirBusqueda(termino).catch(() => termino);
				const data = await apiRecetas.buscarPorNombre(terminoEn);
				if (!activo) return;
				const lista = data.slice(0, 20);
				setResultados(lista);
				setCargando(false);
				// Traducir nombres y categorías de los resultados en segundo plano
				if (lista.length > 0) {
					setTraduciendo(true);
					await Promise.all(
						lista.map(r =>
							Promise.all([
								traducirTituloReceta(r.idMeal, r.strMeal)
									.then(t => { if (activo) setResultados(prev => prev.map(x => x.idMeal === r.idMeal ? { ...x, strMeal: t } : x)); })
									.catch(() => {}),
								r.strCategory
									? traducirTermino(r.strCategory)
										.then(t => { if (activo) setResultados(prev => prev.map(x => x.idMeal === r.idMeal ? { ...x, strCategory: t } : x)); })
										.catch(() => {})
									: Promise.resolve(),
							])
						)
					);
					if (activo) setTraduciendo(false);
				}
			} catch {
				if (activo) setResultados([]);
				if (activo) { setCargando(false); setTraduciendo(false); }
			}
		}, 300);

		return () => {
			activo = false;
			clearTimeout(timer);
		};
	}, [query]);

	const irAReceta = (idMeal) => {
		onCerrar?.();
		navigate(`/receta/${idMeal}`);
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm px-4 py-8">
			<div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden">
				<div className="flex items-center gap-2 border-b border-gray-200 p-3">
					<Search size={18} className="text-gray-400" />
					<input
						autoFocus
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Buscar receta por nombre..."
						className="flex-1 border-none outline-none text-sm"
					/>
					<button
						onClick={onCerrar}
						className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
						aria-label="Cerrar búsqueda"
					>
						<X size={18} />
					</button>
				</div>

				<div className="max-h-[70vh] overflow-y-auto">
					{query.trim().length < 2 && (
						<p className="px-4 py-5 text-sm text-gray-500">
							Escribe al menos 2 caracteres para buscar.
						</p>
					)}

					{cargando && (
						<div className="flex items-center gap-2 px-4 py-5 text-sm text-[#E8631A]">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8631A] border-t-transparent" />
							Buscando recetas...
						</div>
					)}

					{traduciendo && !cargando && (
						<div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 border-b border-gray-100">
							<div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
							Traduciendo resultados...
						</div>
					)}

					{!cargando && query.trim().length >= 2 && resultados.length === 0 && (
						<p className="px-4 py-5 text-sm text-gray-500">No se encontraron resultados.</p>
					)}

					{!cargando && resultados.map((receta) => (
						<button
							key={receta.idMeal}
							onClick={() => irAReceta(receta.idMeal)}
							className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#F5E6D3]/40"
						>
							<img
								src={receta.strMealThumb}
								alt={receta.strMeal}
								className="h-12 w-12 rounded-lg object-cover"
							/>
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-gray-800">{receta.strMeal}</p>
								{receta.strCategory && (
									<p className="text-xs text-gray-500">{receta.strCategory}</p>
								)}
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
