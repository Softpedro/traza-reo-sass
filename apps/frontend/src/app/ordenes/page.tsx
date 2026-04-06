import { OrderRegistroClient } from "@/app/orden-pedido/registro/order-registro-client";

/** Listado alineado con OD_ORDER_HEAD (`/api/order-heads`), misma UX que `/orden-pedido/registro`. */
export default function OrdenesPage() {
  return <OrderRegistroClient title="Órdenes" />;
}
