import React from 'react';
import { BounceLoader } from 'react-spinners';

export default function Secc({ loading, error, data, selectedServicios, handleCheckboxChangeServicios }) {
    return (
        <div>
            {loading ? (
                <BounceLoader />
            ) : error ? (
                <p>Error al cargar datos</p>
            ) : (
                <div className="section-container">
                    {data.map((item) => {
                        const itemFields = item?.fields || {}; 
                        const isChecked = selectedServicios.some((i) => i?.fields?.ID === itemFields.ID);

                        return (
                            <div key={itemFields.ID} className="checkbox-wrapper-24">
                                <input
                                    type="checkbox"
                                    id={`check-servicio-${itemFields.ID}`}
                                    checked={isChecked} // Estado basado en selectedServicios
                                    onChange={() => handleCheckboxChangeServicios(item)} // Controla el cambio
                                />
                                <label htmlFor={`check-servicio-${itemFields.ID}`}>
                                    <span></span>
                                    {itemFields.Producto || "Sin nombre"} {/* Muestra "Sin nombre" si Producto no está definido */}
                                </label>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
