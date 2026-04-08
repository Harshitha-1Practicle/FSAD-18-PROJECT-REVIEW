import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import Pagination from '../components/common/Pagination';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import './ProductsPage.css';

const CATEGORIES = ['SAREES','STOLES','DUPATTAS','KURTAS','DRESS_MATERIAL','JACKETS','SCARVES','HOME_DECOR','ACCESSORIES'];
const SORTS = [{ value:'newest', label:'Newest First' },{ value:'price_asc', label:'Price: Low to High' },{ value:'price_desc', label:'Price: High to Low' },{ value:'rating', label:'Top Rated' }];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '', region: '',
    sort: searchParams.get('sort') || 'newest', page: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, size: 12, sort: filters.sort };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.region) params.region = filters.region;
      const res = await productService.search(params);
      setProducts(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 0);
    } catch {} finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setFilters(f => ({...f, page:0})); };
  const updateFilter = (key, val) => setFilters(f => ({...f, [key]: val, page:0}));
  const clearFilters = () => setFilters({ search:'', category:'', minPrice:'', maxPrice:'', region:'', sort:'newest', page:0 });

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1>Explore Handloom Collection</h1>
          <form onSubmit={handleSearch} className="search-bar">
            <Search size={18} className="search-icon" />
            <input className="search-input" placeholder="Search sarees, stoles, kurtas…" value={filters.search} onChange={e => updateFilter('search', e.target.value)} />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
      </div>

      <div className="container products-layout">
        {/* Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters">Clear all <X size={14}/></button>
          </div>
          <div className="filter-group">
            <label className="filter-label">Category</label>
            {CATEGORIES.map(cat => (
              <label key={cat} className="filter-checkbox">
                <input type="radio" name="category" checked={filters.category===cat} onChange={() => updateFilter('category', filters.category===cat?'':cat)} />
                {cat.replace('_',' ')}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <label className="filter-label">Price Range (₹)</label>
            <div className="price-range">
              <input className="form-input" type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice',e.target.value)} />
              <span>–</span>
              <input className="form-input" type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice',e.target.value)} />
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Region</label>
            <input className="form-input" placeholder="e.g. Varanasi, Kanchipuram" value={filters.region} onChange={e => updateFilter('region',e.target.value)} />
          </div>
        </aside>

        {/* Main */}
        <main className="products-main">
          <div className="products-toolbar">
            <p className="products-count">{products.length > 0 ? `${products.length}+ products` : 'No products found'}</p>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <select className="form-select" style={{width:'auto'}} value={filters.sort} onChange={e => updateFilter('sort',e.target.value)}>
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button className="btn btn-outline mobile-filter-btn" style={{padding:'9px 14px'}} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16}/></button>
            </div>
          </div>
          {loading ? <div className="loading-center"><div className="spinner"/></div> : (
            <>
              {products.length === 0 ? (
                <div className="empty-state">
                  <span>🧵</span>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search term</p>
                  <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
                </div>
              ) : (
                <div className="grid-4">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
              )}
              <Pagination page={filters.page} totalPages={totalPages} onPageChange={p => setFilters(f => ({...f,page:p}))} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
