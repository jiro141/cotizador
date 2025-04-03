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
                <div className="section-container2">
                    {data.map((item) => {
                        const itemFields = item?.fields || {};
                        const isChecked = selectedServicios.some((i) => i?.fields?.ID === itemFields.ID);

                        return (
                            <div key={itemFields.ID} className="checkbox-wrapper-24">
                                <input
                                    type="checkbox"
                                    id={`check-servicio-${itemFields.ID}`}
                                    checked={isChecked}
                                    onChange={() => handleCheckboxChangeServicios(item)}
                                />
                                <label htmlFor={`check-servicio-${itemFields.ID}`}>
                                    <span></span>
                                    {itemFields.Producto || "Sin nombre"}
                                </label>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
