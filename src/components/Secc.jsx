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
                        const itemFields = item|| {};
                        const isChecked = selectedServicios.some((i) => i?.id=== itemFields.id);

                        return (
                            <div key={itemFields.id} className="checkbox-wrapper-24">
                                <input
                                    type="checkbox"
                                    id={`check-servicio-${itemFields.id}`}
                                    checked={isChecked}
                                    onChange={() => handleCheckboxChangeServicios(item)}
                                />
                                <label htmlFor={`check-servicio-${itemFields.id}`}>
                                    <span></span>
                                    {itemFields.producto || "Sin nombre"}
                                </label>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
